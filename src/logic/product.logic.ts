import Product, { IProduct } from "../models/product.model";
import { IListParams, IListResponse, ILogicResponse } from "./interfaces.logic";
import { reply, status } from "../config/config.status";
import { createBOM } from "./batching.logic";
import productModel from "../models/product.model";

export const listProduct = async (
  listParams: IListParams, approved = null
): Promise<ILogicResponse> => {

    //TODO: Add filters to the query with pagination

  const list = await Product.paginate(
    { is_raw:false, status: approved ? 4 : {$ne: 4}}, //filters
    { page: listParams.page, limit: 20, leanWithId: true}
  );
  return {
    status: status.OK,
    data: { message: "", res: list },
  };
};


export const productLookup = async (s_value, f_sale, approved) => {
  const searchValue = s_value.toString();
  const statusList = approved ? [4] : [1,2,3,4];
  const for_sale = { for_sale: f_sale}
  let query = {

    $or: [
      { product_code: new RegExp("^" + searchValue) },
      { name: new RegExp(searchValue, "i") },
      { aliases: new RegExp(searchValue, "i") },
    ],
  }
  if(f_sale != undefined) {
    query = {...query, ...for_sale};
  }
  if(approved != undefined) {
    status: { $in : statusList};
  }
  console.log(for_sale)
  const list = await Product.find(query).limit(15);

  console.log(list);
  return { status: status.OK, data: { message: "", res: list } };
};

export const productLookupByCode = async (lookup_list:string[]) => {
    return await Product.find({ product_code : {$in: lookup_list}, status: 4 });
}