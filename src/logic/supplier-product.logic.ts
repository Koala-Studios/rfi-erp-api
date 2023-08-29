import SupplierProduct, {
  ISupplierProduct,
} from "../models/supplier-product.model";
import { IListParams, IListResponse, ILogicResponse } from "./interfaces.logic";
import { reply, status } from "../config/config.status";
import { IProcessedQuery, processQuery } from "./utils";

export const listSupplierProduct = async (
  query: string,
  supplier_id?: string,
  product_id?: string
): Promise<ILogicResponse> => {
  const { _filter, _page, _count }: IProcessedQuery = processQuery(query);
  let n_query = {};
  if (supplier_id != undefined) {
    n_query = { ...n_query, "supplier._id": supplier_id };
  }
  if (product_id != undefined) {
    n_query = { ...n_query, product_id: product_id }; //TODO: Unfinished..
  }
  const list = await SupplierProduct.paginate(
    { ..._filter, n_query },
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

export const supplierProductLookup = async (s_value) => {
  const searchValue = s_value.toString();
  const list = await SupplierProduct.find({
    name: new RegExp(searchValue, "i"),
  }).limit(15);

  return { status: status.OK, data: { message: "", res: list } };
};
