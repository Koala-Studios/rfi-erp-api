// export const queryToObject = (query: string) => {
//   const params = new URLSearchParams(query);
//   const res = paramsToObject(params);
//   console.log(res);
//   return res;
// };
import { FilterQuery } from "mongoose";
import ProductType from "../models/product-type.model";
import Product from "../models/product.model";
import Formula from "../models/formula.model";
import Inventory from "../models/inventory.model";
import { ILogicResponse } from "./interfaces.logic";

export const generateProductCode = async (
  raw_number: number,
  type_code: string
) => {
  let product_code = type_code + "00000";
  product_code =
    product_code.substring(
      0,
      product_code.length - raw_number.toString().length
    ) + raw_number;
  console.log(product_code, "in function");
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

export const refreshProductCosts = async () => {
  const solutions = await Product.find({
    is_raw: false,
    for_sale: false,
    status: 4,
    "product_type.code": "SM",
  });
  for (const product of solutions) {
    let product_cost = 0;
    const formula = await Formula.findOne({
      product_id: product._id,
      version: product.approved_version,
    });
    for (const ingredient of formula.formula_items) {
      const inv_ing = await Inventory.findById(ingredient.material_id);
      if (inv_ing) {
        product_cost += (inv_ing.cost * ingredient.amount) / 100;
      }
    }
    // console.log(
    //   product.product_code +
    //     ": OLD COST: " +
    //     product.cost +
    //     "NEW COST: " +
    //     product_cost
    // );
    product.cost = Math.round(product_cost * 100) / 100;
    product.save();
  }
  const keys = await Product.find({
    //NON SOLUTIONS
    is_raw: false,
    for_sale: false,
    status: 4,
    "product_type.code": { $not: { $eq: "SM" } },
  });
  for (const product of keys) {
    let product_cost = 0;
    const formula = await Formula.findOne({
      product_id: product._id,
      version: product.approved_version,
    });
    for (const ingredient of formula.formula_items) {
      const inv_ing = await Inventory.findById(ingredient.material_id);
      if (inv_ing) {
        product_cost += (inv_ing.cost * ingredient.amount) / 100;
      }
    }
    // console.log(
    //   product.product_code + ": OLD COST: " + product.cost ||
    //     0 + "NEW COST: " + product_cost
    // );
    product.cost = Math.round(product_cost * 100) / 100;
    product.save();
  }

  const flavors = await Product.find({
    //NON SOLUTIONS
    is_raw: false,
    for_sale: true,
    status: 4,
  });
  for (const product of flavors) {
    let product_cost = 0;
    const formula = await Formula.findOne({
      product_id: product._id,
      version: product.approved_version,
    });
    for (const ingredient of formula.formula_items) {
      const inv_ing = await Inventory.findById(ingredient.material_id);
      if (inv_ing) {
        product_cost += (inv_ing.cost * ingredient.amount) / 100;
      }
    }
    // console.log(
    //   product.product_code + ": OLD COST: " + product.cost ||
    //     0 + "NEW COST: " + product_cost
    // );
    product.cost = Math.round(product_cost * 100) / 100;
    product.save();
  }
  return {};

  //db.getCollection("formulas").find({approved: true, 'formula_items.material_code': "RM00346"}) //TODO: THIS IS FOR INGREDIENT SPECIFIC, finding formulas where the ingredient is present.
};
