import { reply, status } from "../config/config.status";
import SalesOrder, {
  ISalesOrder,
  ISalesOrderItemProcess,
  orderItemStatus,
  orderStatus,
} from "../models/sales-order.model";
import Inventory from "../models/inventory.model";
import mongoose from "mongoose";
import { IListParams, IListResponse, ILogicResponse } from "./interfaces.logic";
import { IProcessedQuery, processQuery } from "./utils";
import { movementTypes } from "../models/inventory-movements.model";
import { moveInventory } from "./inventory-movements.logic";

import Batching, { IBatching } from "../models/batching.model";
let ObjectId = require("mongodb").ObjectId;

export const listSalesOrders = async (
  query: string
): Promise<ILogicResponse> => {
  const { _filter, _page, _count }: IProcessedQuery = processQuery(query);

  const list = await SalesOrder.paginate(_filter, {
    page: _page,
    limit: _count,
    leanWithId: true,
    sort: { _id: "desc" },
  });
  return { status: status.OK, data: { message: null, res: list } };
};

export const getSalesOrder = async (po_id): Promise<ILogicResponse> => {
  let _status: number;

  const p_id = new ObjectId(po_id);

  const _sales_order = await SalesOrder.aggregate(
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
                  $in: ["$_id", "$$ingredients.material_id"],
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
                              $eq: ["$$mb._id", "$$this.material_id"],
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
                        material_name: "$$m.name",
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
  if (!_sales_order[0]) {
    _status = status.OK;
    return {
      status: _status,
      data: { message: "No Sales Order Found", res: null },
    };
  }
  _status = status.OK;

  return {
    status: _status,
    data: { message: "Sales Order", res: _sales_order[0] },
  };
};

export const updateSalesItem = async (placeholder): Promise<ILogicResponse> => {
  //remember there's
  //send to QC or receive into inventory

  return { status: null, data: { message: null, res: null } };
};

export const confirmSales = async (
  purchase: ISalesOrder
): Promise<ILogicResponse> => {
  const po_id = purchase._id;

  purchase.status = orderStatus.AWAITING_PRODUCTION;

  const _sales_order = await SalesOrder.findOneAndUpdate(
    { _id: po_id },
    purchase,
    { new: true }
  );
  for (const item of _sales_order.order_items) {
    const inv_item = await Inventory.findById(item.product_id);
    const movement = {
      product_id: inv_item._id,
      product_code: inv_item.product_code,
      name: inv_item.name,
      module_source: SalesOrder.modelName,
      movement_target_type: movementTypes.ORDERED,
      amount: item.sold_amount,
      movement_date: new Date(),
      target_location: null,
    };
    await moveInventory(movement);
  }
  return {
    status: status.OK,
    data: { message: "Order Successfully Confirmed", res: _sales_order },
  };
};
export const proccessSalesRow = async (
  processItem: ISalesOrderItemProcess,
  order_id: string
): Promise<ILogicResponse> => {
  const sales_order = await SalesOrder.findById(order_id);

  const batch: any = {
    _id: new mongoose.Types.ObjectId(),
    ingredients: [],
    date_created: new Date(),
    product_id: processItem.product_id,
    product_code: processItem.product_code,
    name: processItem.product_name,
    quantity: processItem.process_amount,
    date_needed: processItem.date_needed,
    sales_id: order_id,
    batch_code: new Date().toString().split(":")[0] + "A", //TODO: CHANGE THIS TO PROPER GENERATION, ALSO MOVE CREATION OF BATCH TO LOGIC OF BATCHING
    status: 1,
    notes: "",
  };
  const _batching = new Batching(batch);
  _batching.save();
  const items = sales_order.order_items;
  let item = items.find((item: any) => item._id === processItem._id);
  const index = items.findIndex(
    (item: any) => item._id === processItem._id + 1
  );
  sales_order.order_items = [
    ...items.slice(0, index),

    {
      _id: new ObjectId().toHexString(),
      product_id: processItem.product_id,
      product_code: processItem.product_code,
      product_name: processItem.product_name,
      customer_p_code: "",
      sold_amount: processItem.process_amount,
      unit_price: item.unit_price,
      batch_id: _batching._id,
      batch_code: _batching.batch_code,
      lot_number: null,
      status: orderItemStatus.SCHEDULED,
    },
    ...items.slice(index, items.length),
  ];
  if (item.sold_amount != processItem.process_amount) {
    item.sold_amount = item.sold_amount - processItem.process_amount;
    sales_order.order_items[index - 1] = {
      ...item,
    };
  } else {
    sales_order.order_items.splice(index, 1);
  }

  sales_order.save();

  return {
    status: status.OK,
    data: { message: "Batching Successfully Scheduled", res: sales_order },
  };
};
