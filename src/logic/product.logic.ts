import Product, { IProduct } from "../models/product.model";
import Formula, { IFormula } from "../models/formula.model";
import { IListParams, IListResponse, ILogicResponse } from "./interfaces.logic";
import { reply, status } from "../config/config.status";
import { IProcessedQuery, processQuery } from "./utils";

export const listProduct = async (
  query: string,
  approved: boolean = null,
  f_sale: boolean | undefined = undefined
): Promise<ILogicResponse> => {
  let { _filter, _page, _count }: IProcessedQuery = processQuery(query);
  if (f_sale != undefined) {
    _filter = { ..._filter, for_sale: f_sale };
  }

  const list = await Product.paginate(
    { ..._filter, is_raw: false, status: approved ? 4 : { $ne: 4 } }, //filters
    {
      page: _page,
      limit: _count,
      leanWithId: true,
      sort: { created_date: -1 },
    }
  );
  return {
    status: status.OK,
    data: { message: "", res: list },
  };
};

export const productLookup = async (s_value, f_sale, approved) => {
  const searchValue = s_value.toString();
  const statusList = approved ? [4, 3] : [1, 2, 3, 4];
  const for_sale = { for_sale: f_sale };
  let query = {
    is_raw: false,
    $or: [
      { aliases: new RegExp(searchValue, "i") },
      { product_code: new RegExp("^" + searchValue) },
      { name: new RegExp(searchValue, "i") },
    ],
  };
  if (f_sale != undefined) {
    query = { ...query, ...for_sale };
  }
  if (approved != undefined) {
    status: {
      $in: statusList;
    }
  }
  // console.log(for_sale);
  const list = await Product.find(query).limit(25);

  // console.log(list);
  return { status: status.OK, data: { message: "", res: list } };
};

export const productLookupByCode = async (lookup_list: string[]) => {
  return await Product.find({ product_code: { $in: lookup_list }, status: 4 });
};

export const updateProductPrice = async (
  _product_id: string
): Promise<number> => {
  const amount = await recursivePriceUpdater(_product_id, 1, 0);
  console.log(amount, "FINAL");
  return amount;
};

const recursivePriceUpdater = async (
  product_id: string,
  amount: number,
  totalCost: number
) => {
  const product = await Product.findById(product_id);
  if (product.is_raw === null || product.is_raw) {
    return product.cost * amount;
  } else {
    const formula = await Formula.findOne({
      product_id: product._id,
      version: product.versions,
    });
    if (formula) {
      for (const form_item of formula.formula_items) {
        totalCost +=
          ((await recursivePriceUpdater(
            form_item.material_id,
            form_item.amount,
            totalCost / 100
          )) *
            amount) /
          100;
      }
    } else {
      totalCost += (product.cost * amount) / 100;
    }
    return totalCost;
  }
};
