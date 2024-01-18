import InventoryStock, {
  IInventoryStock,
} from "../models/inventory-stock.model";
import { IListParams, IListResponse, ILogicResponse } from "./interfaces.logic";
import { reply, status } from "../config/config.status";
import { IProcessedQuery, processQuery } from "./utils";
import { ObjectId } from "mongodb";

// export const listInventory = async():Promise<IInventory[]> => {
//     //filters: all
//     const _inventoryStock = await Inventory.find({}).limit(100);
//     // console.log(_inventoryStock);
//     return _inventoryStock;
// }

//TODO: Fix this if necessary, not being used
// export const listInventoryStock = async (
//   query: string
// ): Promise<ILogicResponse> => {
//   const { _filter, _page, _count }: IProcessedQuery = processQuery(query);

//   const list = await InventoryStock.paginate(_filter, {
//     page: _page,
//     limit: _count,
//     leanWithId: true,
//     // sort: { date_created: 'desc' }

//   });

//   return {
//     status: status.OK,
//     data: { message: "", res: list },
//   };

// };

export const listInventoryStockGrouped = async (
  //TODO: IMPLEMENT FILTERS INTO AGGREGATE PAGINATE
  query: string
): Promise<ILogicResponse> => {
  const { _filter, _page, _count }: IProcessedQuery = processQuery(query);

  const tester = InventoryStock.aggregate([
    { $sort: { product_id: 1 } },
    { $match: _filter },
    {
      $group: {
        _id: { product_id: "$product_id", product_code: "$product_code" },

        product_code: { $first: "$product_code" },
        name: { $first: "$name" },
        average_cost: {
          $sum: { $multiply: ["$unit_cost", "$received_amount"] },
        },
        received_amount: { $sum: "$received_amount" },
        remaining_amount: { $sum: "$remaining_amount" },
        allocated_amount: { $sum: "$allocated_amount" },
        quarantined_containers: { $sum: "$quarantined_containers" },
        items: {
          $push: {
            _id: "$_id",
            name: "$name",
            unit_cost: "$unit_cost",
            received_amount: "$received_amount",
            remaining_amount: "$remaining_amount",
            allocated_amount: "$allocated_amount",
            quarantined_containers: "$quarantined_containers",
            lot_number: "$lot_number",
            received_date: "$received_date",
            expiry_date: "$expiry_date",
            supplier_code: "$supplier_code",
            supplier_id: "$supplier_id",
            supplier_sku: "$supplier_sku",
            notes: "$notes",
            extensions: "$extensions",
            qc_tests: "$qc_tests",
          },
        },
      },
    },
    {
      $set: {
        average_cost: {
          $cond: {
            if: { $gt: ["$average_cost", 0] },
            then: {
              $round: [
                { $divide: ["$average_cost", { $sum: "$received_amount" }] },
                2,
              ],
            },
            else: 0,
          },
        },
      },
    },
    { $sort: { product_code: -1 } },
  ]);

  const list = await InventoryStock.aggregatePaginate(tester, {
    page: _page,
    limit: _count,
    leanWithId: true,
  });

  return {
    status: status.OK,
    data: { message: "", res: list },
  };
};

export const inventoryStockLookup = async (s_value, p_id) => {
  const searchValue = s_value.toString();
  const prod_query = { product_id: p_id };
  console.log(p_id, "TEST");
  let query = {
    $or: [
      { product_code: new RegExp("^" + searchValue) },
      { name: new RegExp(searchValue, "i") },
      { lot_number: new RegExp(searchValue, "i") },
    ],
  };
  if (p_id) {
    query = { ...query, ...prod_query };
  }
  const list = await InventoryStock.find(query)
    // .populate({ path: "product_id" }) //TODO: this gives an error unfortunately, not sure how to deal with it.
    .limit(15)
    .catch((err) => {
      console.log(err, "ERROR");
    });

  return { status: status.OK, data: { message: "", res: list } };
};

export const listInventoryContainers = async (
  query: string,
  product_id?: string
): Promise<ILogicResponse> => {
  const { _filter, _page, _count }: IProcessedQuery = processQuery(query);
  const filter = product_id
    ? { product_id: new ObjectId(product_id) }
    : _filter;
  const tester = InventoryStock.aggregate([
    { $sort: { product_id: 1 } },
    { $match: filter },
  ]);

  const list = await InventoryStock.aggregatePaginate(tester, {
    page: _page,
    limit: _count,
    leanWithId: true,
  });
  console.log(list);
  return { status: status.OK, data: { message: null, res: list } };
};
