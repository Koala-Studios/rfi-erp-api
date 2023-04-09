import Inventory, { IInventory } from "../models/inventory.model";
import { IListParams, IListResponse, ILogicResponse } from "./interfaces.logic";
import { reply, status } from "../config/config.status";
import { FilterQuery } from "mongoose";

// export const listInventory = async():Promise<IInventory[]> => {
//     //filters: all
//     const _inventory = await Inventory.find({}).limit(100);
//     // console.log(_inventory);
//     return _inventory;
// }

export const listInventory = async (
  listParams: IListParams
): Promise<ILogicResponse> => {
  const query = JSON.parse(listParams.filter) as FilterQuery<IInventory>;

  const list = await Inventory.paginate(query, {
    page: listParams.page,
    limit: listParams.count,
    leanWithId: true,
  });

  return {
    status: status.OK,
    data: { message: null, res: list },
  };
};

export const inventoryLookup = async (s_value, f_sale) => {
  const searchValue = s_value.toString();
  const list = await Inventory.find({
    for_sale: f_sale,
    $or: [
      { product_code: new RegExp("^" + searchValue) },
      { name: new RegExp(searchValue, "i") },
    ],
  }).limit(15);
  return { status: status.OK, data: { message: "", res: list } };
};
