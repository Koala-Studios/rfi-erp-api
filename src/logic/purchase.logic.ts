import { reply, status } from "../config/config.status";
import PurchaseOrder, {
  IOrderItemProcess,
  IPurchaseOrder,
  orderStatus,
} from "../models/purchase-order.model";
import Inventory from "../models/inventory.model";
import mongoose from "mongoose";
import { IListParams, IListResponse, ILogicResponse } from "./interfaces.logic";
import { inventoryLookup } from "./inventory.logic";
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
  const order_item = purchase_order[item_index];
  purchase_order.save();
  const approved_by_qc = true;
  if (quarantine) {
    inv_item.stock.quarantined += row.process_amount;
    inv_item.stock.on_order -= row.process_amount;
    inv_item.save();
    _message = "Sent To Quarantine Successfully";
  } else {
    //TODO: Change this step to ONLY send to QC. QC will then call the receiveItem function on its own
    inv_item.stock.on_order -= row.process_amount; //TODO: This will soon be replaced by the movement logs (will also use findOneAndUpdate)
    inv_item.stock.on_hold += row.process_amount;
    inv_item.save();
    if (approved_by_qc) {
      receiveItem(row);
      _message = "Sent To QC Successfully";
    }
  }
  _status = status.OK;
  return { status: _status, data: { message: _message, res: order_item } };
};

export const receiveItem = async (
  row: IOrderItemProcess
): Promise<ILogicResponse> => {
  let _status: number;
  let _message: string = "";
  const inv_item = await Inventory.findOneAndUpdate(
    { _id: row.product_id },
    {
      $inc: {
        "stock.on_hand": row.process_amount,
        "stock.on_hold": -row.process_amount,
      },
    }
  );
  _status = status.OK;
  return {
    status: _status,
    data: { message: "Successfully Added To Inventory", res: null },
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
    await Inventory.findOneAndUpdate(
      { _id: item.product_id },
      { $inc: { "stock.on_order": item.purchased_amount } }
    );
  }

  return {
    status: status.OK,
    data: { message: "Order Successfully Confirmed", res: _purchase },
  };
};

export const setAsReceived = async (po_id): Promise<ILogicResponse> => {
  const purchase_order = await PurchaseOrder.findById(po_id);
  const order_items = purchase_order.order_items;
  for (let index = 0; index < order_items.length; index++) {
    const order_item = order_items[index];
    const inv_item = await Inventory.findById(order_item.product_id);
    inv_item.stock.on_order -=
      order_item.purchased_amount - order_item.received_amount; //TODO: Update To Movements
    inv_item.save();
  }
  purchase_order.status = 4;
  purchase_order.save();

  return {
    status: status.OK,
    data: { message: "Order Successfully Marked As Received", res: true },
  };
};
