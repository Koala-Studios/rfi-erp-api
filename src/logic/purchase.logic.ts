import { reply, status } from "../config/config.status";
import PurchaseOrder, {
  IOrderItemProcess,
  IPurchaseOrder,
  orderStatus,
} from "../models/purchase-order.model";
import Inventory, { IInventory } from "../models/inventory.model";
import { IListParams, IListResponse, ILogicResponse } from "./interfaces.logic";
import { inventoryLookup } from "./inventory.logic";
import { IMovement, moveInventory } from "./inventory-movements.logic";
import InventoryStock, {
  IInventoryStock,
} from "../models/inventory-stock.model";
import { movementTypes } from "../models/inventory-movements.model";
import { IProcessedQuery, processQuery } from "./utils";
let ObjectId = require("mongodb").ObjectId;

export const listPurchases = async (query: string): Promise<ILogicResponse> => {
  const { _filter, _page, _count }: IProcessedQuery = processQuery(query);

  const list = await PurchaseOrder.paginate(_filter, {
    page: _page,
    limit: _count,
    leanWithId: true,
    sort: { date_purchased: "desc" },
  });

  return {
    status: status.OK,
    data: { message: "", res: list },
  };
};

export const listSupplierOrders = async (
  query: string,
  supplier_id?: string
): Promise<ILogicResponse> => {
  const { _filter, _page, _count }: IProcessedQuery = processQuery(query);
  const list = await PurchaseOrder.paginate(
    supplier_id != undefined ? { supplier_id: supplier_id } : _filter,
    {
      page: _page,
      limit: _count,
      leanWithId: true,
      sort: { movement_date: "desc" },
    }
  );

  return { status: status.OK, data: { message: null, res: list } };
};

export const getPO = async (po_id): Promise<ILogicResponse> => {
  let _status: number;

  const p_id = new ObjectId(po_id);

  const _purchase_order = await PurchaseOrder.aggregate(
    [
      {
        $match: {
          _id: p_id,
        },
      },
      {
        $lookup: {
          from: "inventory",
          let: {
            ingredients: "$order_items",
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $in: ["$_id", "$$ingredients.product_id"],
                },
              },
            },
            {
              $project: {
                name: 1.0,
              },
            },
          ],
          as: "order_info",
        },
      },
      {
        $addFields: {
          order_items: {
            $map: {
              input: "$order_items",
              in: {
                $let: {
                  vars: {
                    m: {
                      $arrayElemAt: [
                        {
                          $filter: {
                            input: "$order_info",
                            cond: {
                              $eq: ["$$mb._id", "$$this.product_id"],
                            },
                            as: "mb",
                          },
                        },
                        0.0,
                      ],
                    },
                  },
                  in: {
                    $mergeObjects: [
                      "$$this",
                      {
                        product_name: "$$m.name",
                      },
                    ],
                  },
                },
              },
            },
          },
        },
      },
      {
        $unset: ["order_info"],
      },
    ],
    {
      allowDiskUse: false,
    }
  );
  if (!_purchase_order[0]) {
    _status = status.OK;
    return {
      status: _status,
      data: { message: "No Purchase Order Found", res: null },
    };
  }
  _status = status.OK;

  return {
    status: _status,
    data: { message: "Purchase Order", res: _purchase_order[0] },
  };
};

export const updatePurchaseItem = async (
  placeholder
): Promise<ILogicResponse> => {
  //remember there's
  //send to QC or receive into inventory

  return { status: null, data: { message: null, res: null } };
};

export const proccessPurchaseRow = async (
  row: IOrderItemProcess,
  quarantine: boolean
): Promise<ILogicResponse> => {
  let _status: number;
  let _message: string = "";
  const purchase_order = await PurchaseOrder.findOne({
    "order_items._id": row._id,
  });
  const item_index = purchase_order.order_items.findIndex(
    (item) => item._id.toString() === row._id.toString()
  );
  const inv_item = await Inventory.findById(row.product_id);

  purchase_order.order_items[item_index].received_amount += row.process_amount;
  const order_item = purchase_order.order_items[item_index];
  purchase_order.save();

  const container = await InventoryStock.create({
    product_id: inv_item._id,
    product_code: inv_item.product_code,
    name: inv_item.name,
    unit_cost: row.unit_price,
    lot_number: row.lot_number,
    container_size: row.container_size,
    received_amount: row.process_amount,
    remaining_amount: row.process_amount,
    allocated_amount: row.process_amount,
    quarantined_containers: 0,
    received_date: new Date(),
    expiry_date: row.expiry_date,
    supplier_code: purchase_order.supplier.code, //TODO: change to code.
    supplier_id: purchase_order.supplier._id,
    supplier_sku: "",
    notes: purchase_order.notes,
    extensions: [],
    qc_tests: [],
  });

  const approved_by_qc = true;
  const movement: IMovement = {
    product_id: inv_item._id,
    product_code: inv_item.product_code,
    name: inv_item.name,
    lot_number: row.lot_number,
    module_source: PurchaseOrder.modelName,
    movement_target_type: quarantine
      ? movementTypes.QUARANTINED
      : movementTypes.ON_HOLD,
    amount: row.process_amount,
    movement_date: new Date(),
    container_id: container._id,
  };
  const movement_source = {
    movement_source_type: movementTypes.ORDERED,
  };
  await moveInventory(movement, movement_source);
  if (quarantine) {
    _message = "Sent To Quarantine Successfully";
  } else {
    //TODO: Change this step to ONLY send to QC. QC will then call the receiveItem function on its own
    if (approved_by_qc) {
      receiveItem(row, inv_item);
      _message = "Sent To QC Successfully";
    }
  }
  _status = status.OK;
  return { status: _status, data: { message: _message, res: purchase_order } };
};

export const receiveItem = async (
  row: IOrderItemProcess,
  inv_item: IInventory
): Promise<ILogicResponse> => {
  let _status: number;
  let _message: string = "";

  const movement = {
    product_id: inv_item._id,
    product_code: inv_item.product_code,
    name: inv_item.name,
    module_source: PurchaseOrder.modelName,
    movement_target_type: movementTypes.ON_HAND,
    amount: row.process_amount,
    lot_number: row.lot_number,
    movement_date: new Date(),
  };
  const movement_source = {
    movement_source_type: movementTypes.ON_HOLD,
  };
  const _res = await moveInventory(movement, movement_source);

  _status = status.OK;
  return {
    status: _status,
    data: { message: "Successfully Added To Inventory", res: null },
  };
};
export const handlePurchaseShipment = async (
  purchase: IPurchaseOrder
): Promise<ILogicResponse> => {
  for (const item of purchase.order_items) {
    const inv_item = await Inventory.findById(item.product_id);
    const movement = {
      product_id: inv_item._id,
      product_code: inv_item.product_code,
      name: inv_item.name,
      module_source: PurchaseOrder.modelName,
      movement_target_type: movementTypes.IN_TRANSIT,
      amount: item.purchased_amount,
      movement_date: new Date(),
    };
    const movement_source = {
      movement_source_type: movementTypes.ORDERED,
    };
    await moveInventory(movement, movement_source);
  }
  return {
    status: status.OK,
    data: { message: "Success", res: null },
  };
};

export const confirmPurchase = async (
  purchase: IPurchaseOrder
): Promise<ILogicResponse> => {
  const po_id = purchase._id;

  purchase.status =
    purchase.shipping_code != null && purchase.shipping_code != ""
      ? orderStatus.AWAITING_ARRIVAL
      : orderStatus.AWAITING_SHIPPING;

  const _purchase = await PurchaseOrder.findOneAndUpdate(
    { _id: po_id },
    purchase,
    { new: true }
  );
  for (const item of _purchase.order_items) {
    const inv_item = await Inventory.findById(item.product_id);
    const movement = {
      product_id: inv_item._id,
      product_code: inv_item.product_code,
      name: inv_item.name,
      module_source: PurchaseOrder.modelName,
      movement_target_type: movementTypes.ORDERED,
      amount: item.purchased_amount,
      movement_date: new Date(),
    };
    await moveInventory(movement);
  }

  return {
    status: status.OK,
    data: { message: "Order Successfully Confirmed", res: _purchase },
  };
};

export const setAsReceived = async (po_id): Promise<ILogicResponse> => {
  const purchase_order = await PurchaseOrder.findById(po_id);
  const order_items = purchase_order.order_items;
  for (const order_item of order_items) {
    if (order_item.purchased_amount - order_item.received_amount > 0) {
      const inv_item = await Inventory.findById(order_item.product_id);
      const movement = {
        product_id: inv_item._id,
        product_code: inv_item.product_code,
        name: inv_item.name,
        module_source: PurchaseOrder.modelName,
        movement_target_type:
          purchase_order.status == orderStatus.AWAITING_SHIPPING
            ? movementTypes.ORDERED
            : movementTypes.IN_TRANSIT,
        amount: -(order_item.purchased_amount - order_item.received_amount),
        movement_date: new Date(),
      };
      await moveInventory(movement);
    }
  }
  purchase_order.status = orderStatus.RECEIVED;
  purchase_order.save();

  return {
    status: status.OK,
    data: {
      message: "Order Successfully Marked As Received",
      res: purchase_order,
    },
  };
};

export const setAsCancelled = async (po_id): Promise<ILogicResponse> => {
  const purchase_order = await PurchaseOrder.findById(po_id);
  const order_items = purchase_order.order_items;
  for (const order_item of order_items) {
    if (order_item.purchased_amount - order_item.received_amount > 0) {
      const inv_item = await Inventory.findById(order_item.product_id);
      const movement = {
        product_id: inv_item._id,
        product_code: inv_item.product_code,
        name: inv_item.name,
        module_source: PurchaseOrder.modelName,
        movement_target_type:
          purchase_order.status == orderStatus.AWAITING_SHIPPING
            ? movementTypes.ORDERED
            : movementTypes.IN_TRANSIT,
        amount: -(order_item.purchased_amount - order_item.received_amount),
        movement_date: new Date(),
      };
      await moveInventory(movement);
    }
  }
  purchase_order.status = orderStatus.ABANDONED;
  purchase_order.save();
  return {
    status: status.OK,
    data: {
      message: "Order Successfully Marked As Abandoned",
      res: purchase_order,
    },
  };
};
