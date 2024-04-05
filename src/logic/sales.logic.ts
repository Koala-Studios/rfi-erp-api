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

import Batching, { IBatching, batchingSource } from "../models/batching.model";
import { createBatching } from "./batching.logic";
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
  salesOrder: ISalesOrder
): Promise<ILogicResponse> => {
  const so_id = salesOrder._id;

  salesOrder.status = orderStatus.AWAITING_PRODUCTION;

  const _sales_order = await SalesOrder.findOneAndUpdate(
    { _id: so_id },
    salesOrder,
    { new: true }
  );
  for (const item of _sales_order.order_items) {
    const inv_item = await Inventory.findById(item.product._id);
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
  var start = new Date();
  start.setHours(0, 0, 0, 0);

  var end = new Date();
  end.setHours(23, 59, 59, 999);

  const batches_today =
    (await Batching.count({
      "customer._id": sales_order.customer._id,
      date_created: { $gte: start, $lt: end },
    })) + 1;

  const _batch_code =
    sales_order.customer.code +
    new Date().toISOString().split("T")[0].replace("-", "") +
    "-" +
    batches_today;
  const batch: any = {
    _id: new mongoose.Types.ObjectId(),
    ingredients: [],
    date_created: new Date(),
    product_id: processItem.product._id,
    product_code: processItem.product.product_code,
    name: processItem.product.name,
    customer: {
      _id: sales_order.customer._id,
      code: sales_order.customer.code,
    },
    source_id: sales_order._id,
    source_type: batchingSource.SALES_ORDER,
    quantity: processItem.sold_amount,
    date_needed: processItem.date_needed,
    sales_id: order_id,
    batch_code: _batch_code, //TODO: CHANGE THIS TO PROPER GENERATION, ALSO MOVE CREATION OF BATCH TO LOGIC OF BATCHING
    status: 1,
    notes: "",
  };
  const _batching = (await createBatching(batch)).data.res;
  const items = sales_order.order_items;
  const index = items.findIndex((item: any) => item._id === processItem._id);
  items[index].status = orderItemStatus.SCHEDULED;
  items[index].batch_id = batch._id;
  sales_order.order_items = items;
  sales_order.save();

  return {
    status: status.OK,
    data: { message: "Batching Successfully Scheduled", res: sales_order },
  };
};
