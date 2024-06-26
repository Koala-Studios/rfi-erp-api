import Inventory, { IInventory } from "../models/inventory.model";
import { IListParams, IListResponse, ILogicResponse } from "./interfaces.logic";
import { reply, status } from "../config/config.status";
import { FilterQuery } from "mongoose";
import { IProcessedQuery, processQuery } from "./utils";

export const listInventory = async (
  query: string,
  f_sale: boolean | undefined
): Promise<ILogicResponse> => {
  let { _filter, _page, _count }: IProcessedQuery = processQuery(query);
  if (f_sale != undefined) {
    _filter = { ..._filter, for_sale: f_sale };
  }
  const list = await Inventory.paginate(_filter, {
    page: _page,
    limit: _count,
    leanWithId: true,
    sort: { _id: "asc" }, //TODO: CHANGE TO DATE LOL.
  });

  return { status: status.OK, data: { message: null, res: list } };
};

export const inventoryLookup = async (s_value, f_sale, i_raw, approved) => {
  const searchValue = s_value.toString();
  const statusList = approved ? [4] : [1, 2, 3, 4];
  const for_sale_obj = { for_sale: f_sale };
  const is_raw_obj = { is_raw: i_raw };
  let query = {
    status: { $in: statusList },
    $or: [
      { aliases: new RegExp(searchValue, "i") },
      { product_code: new RegExp("^" + searchValue) },
      { name: new RegExp(searchValue, "i") },
    ],
  };
  if (f_sale != undefined) {
    query = { ...query, ...for_sale_obj };
  }
  if (i_raw != undefined) {
    query = { ...query, ...is_raw_obj };
  }
  if (approved != undefined) {
    status: {
      $in: statusList;
    }
  }

  const list = await Inventory.find(query).limit(25);
  return { status: status.OK, data: { message: "", res: list } };
};

export const getInventory = async (id) => {
  const _item = await Inventory.findById(id).catch((err) => console.log(err));
  return { status: status.OK, data: { message: "Item Found", res: _item } };
};
