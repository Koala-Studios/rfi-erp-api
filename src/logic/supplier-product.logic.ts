import SupplierProduct, {
  ISupplierProduct,
} from "../models/supplier-product.model";
import { IListParams, IListResponse, ILogicResponse } from "./interfaces.logic";
import { reply, status } from "../config/config.status";
import { IProcessedQuery, processQuery } from "./utils";

export const listSupplierProduct = async (
  query: string
): Promise<ILogicResponse> => {
  const { _filter, _page, _count }: IProcessedQuery = processQuery(query);

  const list = await SupplierProduct.paginate(_filter, {
    page: _page,
    limit: _count,
    leanWithId: true,
    // sort: { date_created: 'desc' }
  });
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
