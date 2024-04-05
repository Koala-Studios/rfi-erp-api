import CustomerProduct, {
  ICustomerProduct,
} from "../models/customer-product.model";
import { IListParams, IListResponse, ILogicResponse } from "./interfaces.logic";
import { reply, status } from "../config/config.status";
import { IProcessedQuery, processQuery } from "./utils";

export const listCustomerProduct = async (
  query: string,
  customer_id: string
): Promise<ILogicResponse> => {
  const { _filter, _page, _count }: IProcessedQuery = processQuery(query);

  const list = await CustomerProduct.paginate(
    { ..._filter, "customer._id": customer_id },
    {
      page: _page,
      limit: _count,
      leanWithId: true,
      // sort: { date_created: 'desc' }
    }
  );
  return {
    status: status.OK,
    data: { message: "", res: list },
  };
};

export const customerProductLookup = async (s_value, customer_id: string) => {
  const searchValue = s_value.toString();
  let query = {
    "customer._id": customer_id,
    $or: [
      { customer_sku: new RegExp(searchValue, "i") },
      { "product.product_code": new RegExp(searchValue, "i") },
      { c_prod_name: new RegExp(searchValue, "i") },
      { "product.name": new RegExp(searchValue, "i") },
    ],
  };
  const list = await CustomerProduct.find(query).limit(25);
  return { status: status.OK, data: { message: "", res: list } };
};
