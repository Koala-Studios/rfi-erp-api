// export const queryToObject = (query: string) => {
//   const params = new URLSearchParams(query);
//   const res = paramsToObject(params);
//   console.log(res);
//   return res;
// };
import { FilterQuery } from "mongoose";
import ProductType, { IProductType } from "../models/product-type.model";
import Product, { IProduct } from "../models/product.model";

export const generateProductCode = async (raw_number:number, type_code:string) => { 
  let product_code = type_code + "00000";
  product_code =
    product_code.substring(
      0,
      product_code.length - raw_number.toString().length) +(raw_number);
  console.log(product_code, 'in function')
  return product_code;
};

export interface IProcessedQuery {
  _filter: FilterQuery<any>;
  _page: number;
  _count: number;
  //   _sortBy: any;
}

export const processQuery = (query): IProcessedQuery => {
  let result: IProcessedQuery = { _filter: {}, _page: 1, _count: 25 };

  const queryObj = JSON.parse(query);
  console.log("queryobj", queryObj);

  if (queryObj["page"]) result._page = parseInt(queryObj["page"]);

  if (queryObj["count"]) result._count = parseInt(queryObj["count"]);

  delete queryObj["page"];
  delete queryObj["count"];

  result._filter = queryObj;
  console.log("result process query", result);

  return result;
};
