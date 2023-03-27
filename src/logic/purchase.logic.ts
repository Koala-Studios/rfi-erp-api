import { reply, status } from "../config/config.status";
import PurchaseOrder, {
  IOrderItemProcess,
  IPurchaseOrder,
  orderStatus,
} from "../models/purchase-order.model";
import Inventory, { IInventory } from "../models/inventory.model";
import mongoose from "mongoose";
import { IListParams, IListResponse, ILogicResponse } from "./interfaces.logic";
import { inventoryLookup } from "./inventory.logic";
import { moveInventory } from "./inventory_movements.logic";
import { movementTypes } from "../models/inventory-movements.model";
let ObjectId = require("mongodb").ObjectId;

export const listPurchases = async (
  listParams: IListParams
): Promise<ILogicResponse> => {
  const list = await PurchaseOrder.paginate(
    {},
    {
      page: listParams.page,
      limit: listParams.count,
      leanWithId: true,
      sort: { date_purchased: -1 },
    }
  );

  return {
    status: status.OK,
    data: { message: "", res: list },
  };
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

  console.log(
    "po: ",
    purchase_order,
    "invitem: ",
    inv_item,
    "order_item: " + purchase_order.order_items[item_index]
  );
  // order_item, "OK IT WORKED?!?!")

  purchase_order.order_items[item_index].received_amount += row.process_amount;
  const order_item = purchase_order.order_items[item_index];
  purchase_order.save();
  const approved_by_qc = true;
  const movement = {
    product_id: inv_item._id,
    product_code: inv_item.product_code,
    name: inv_item.name,
    module_source: PurchaseOrder.modelName,
    movement_target_type: quarantine ? movementTypes.QUARANTINED : movementTypes.ON_HOLD,
    amount: row.process_amount
  }
  const movement_source = {
    movement_source_type: movementTypes.IN_TRANSIT,
    amount: row.process_amount
  }
  await moveInventory(movement, movement_source);
  if (quarantine) {
    _message = "Sent To Quarantine Successfully"
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
    product_id: inv_item._id ,
    product_code: inv_item.product_code,
    name: inv_item.name,
    module_source: PurchaseOrder.modelName,
    movement_target_type: movementTypes.ON_HAND,
    amount: row.process_amount
  }
  const movement_source = {
    movement_source_type: movementTypes.ON_HOLD,
    amount: row.process_amount
  }
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
      product_id: inv_item._id ,
      product_code: inv_item.product_code,
      name: inv_item.name,
      module_source: PurchaseOrder.modelName,
      movement_target_type: movementTypes.IN_TRANSIT,
      amount: item.purchased_amount
    }
    const movement_source = {
      movement_source_type: movementTypes.ON_ORDER,
      amount: item.purchased_amount
    };
    await moveInventory(movement,movement_source);
  }
  return {
    status: status.OK,
    data: { message: "Success", res: null },
  };
}

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
      product_id: inv_item._id ,
      product_code: inv_item.product_code,
      name: inv_item.name,
      module_source: PurchaseOrder.modelName,
      movement_target_type: movementTypes.ON_ORDER,
      amount: item.purchased_amount
    }
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
    if(order_item.purchased_amount - order_item.received_amount > 0) {
      const inv_item = await Inventory.findById(order_item.product_id);
      const movement = {
        product_id: inv_item._id ,
        product_code: inv_item.product_code,
        name: inv_item.name,
        module_source: PurchaseOrder.modelName,
        movement_target_type: purchase_order.status == orderStatus.AWAITING_SHIPPING ? movementTypes.ON_ORDER : movementTypes.IN_TRANSIT,
        amount: - (order_item.purchased_amount - order_item.received_amount)
      }
      await moveInventory(movement);
    }


    
  }
  purchase_order.status = orderStatus.RECEIVED;
  purchase_order.save();

  return {
    status: status.OK,
    data: { message: "Order Successfully Marked As Received", res: purchase_order },
  };
};


export const setAsCancelled = async (po_id): Promise<ILogicResponse> => {
  const purchase_order = await PurchaseOrder.findById(po_id);
  const order_items = purchase_order.order_items;
  for (const order_item of order_items) {
    if(order_item.purchased_amount - order_item.received_amount > 0) {
      const inv_item = await Inventory.findById(order_item.product_id);
      const movement = {
        product_id: inv_item._id ,
        product_code: inv_item.product_code,
        name: inv_item.name,
        module_source: PurchaseOrder.modelName,
        movement_target_type: purchase_order.status == orderStatus.AWAITING_SHIPPING ? movementTypes.ON_ORDER : movementTypes.IN_TRANSIT,
        amount: - (order_item.purchased_amount - order_item.received_amount)
      }
      await moveInventory(movement);
    }
  }
  purchase_order.status = orderStatus.ABANDONED;
  purchase_order.save();
  return {
    status: status.OK,
    data: { message: "Order Successfully Marked As Abandoned", res: purchase_order },
  };
};