// export const queryToObject = (query: string) => {
//   const params = new URLSearchParams(query);
//   const res = paramsToObject(params);
//   console.log(res);
//   return res;
// };
import { FilterQuery } from "mongoose";
import ProductType, { IProductType } from "../models/product-type.model";
import Product, { IProduct } from "../models/product.model";

export const generateProductCode = async (product_type: IProductType) => {
  const result: any = await Product.aggregate([
    {
      $match: { product_code: { $regex: new RegExp("^" + product_type.code) } },
    },
    {
      $group: {
        _id: "$product_type",
        number: {
          $max: {
            $toInt: {
              $substrCP: [
                "$product_code",
                2,
                {
                  $subtract: [
                    { $strLenCP: "$product_code" },
                    product_type.code.length,
                  ],
                },
              ],
            },
          },
        },
      },
    },
  ]);
  const raw_number = result.length > 0 ? result[0].number : 0;
  let product_code = product_type.code + "00000";
  product_code =
    product_code.substring(
      0,
      product_code.length - raw_number.toString().length
    ) +
    (raw_number + 1);

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
