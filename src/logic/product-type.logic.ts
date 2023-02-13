import ProductType, { IProductType } from "../models/product-type.model";
import { IListParams, IListResponse, ILogicResponse } from "./interfaces.logic";
import { reply, status } from "../config/config.status";

export const listProductType = async (
  listParams: IListParams
): Promise<ILogicResponse> => {
  const list = await ProductType.paginate(
    {},
    { page: listParams.page, limit: listParams.count, leanWithId: true }
  );

  return {
    status: status.OK,
    data: { message: "", res: list },
  };
};

export const productTypeLookup = async (s_value, f_sale:boolean) => {
  const searchValue = s_value.toString();
  const list = await ProductType.find({ name: new RegExp(searchValue, 'i'), for_sale:f_sale }).limit(15);

  return { status: status.OK, data: { message: "", res: list } };
};
