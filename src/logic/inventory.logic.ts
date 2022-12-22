import Inventory, { IInventory } from "../models/inventory.model";
import { IListParams, IListResponse, ILogicResponse } from "./interfaces.logic";
import { reply, status } from "../config/config.status";

// export const listInventory = async():Promise<IInventory[]> => {
//     //filters: all
//     const _inventory = await Inventory.find({}).limit(100);
//     // console.log(_inventory);
//     return _inventory;
// }

export const listInventory = async (
  listParams: IListParams
): Promise<ILogicResponse> => {
  const list = await Inventory.paginate(
    {},
    { page: listParams.page, limit: listParams.count, leanWithId: true }
  );

  return {
    status: status.OK,
    data: { message: "", res: list },
  };
};

export const calculateAvailable = async (product_id) => {
  const product = await Inventory.findById(product_id);
  console.log(product)
  if(product) {
    for(let i = 0; i < product!.stock.length; i++) {
      
    }
  } 
}


export const inventoryLookup = async (s_value, f_sale) => {
  const searchValue = s_value.toString();
  const list = await Inventory.find(
    {
      for_sale: f_sale, 
      $or: [
      {product_code:   new RegExp('^' + searchValue) },
      {name: new RegExp(searchValue)}
      ]
    }).limit(15);

    console.log(list)
    return {status: status.OK,
      data: { message: "", res: list }};
}