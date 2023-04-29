import ProductType, { IProductType } from "../models/product-type.model";
import { IListParams, IListResponse, ILogicResponse } from "./interfaces.logic";
import { reply, status } from "../config/config.status";
import { IProcessedQuery, processQuery } from "./utils";

export const listProductType = async (
  query:string
): Promise<ILogicResponse> => {
  const { _filter, _page, _count }: IProcessedQuery = processQuery(query);

  const list = await ProductType.paginate(_filter, {
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

export const productTypeLookup = async (s_value, f_sale, i_raw) => {
  const searchValue = s_value.toString();
  let query = { name: new RegExp(searchValue, 'i')}
  console.log(f_sale, i_raw,' bruh bruh')
  if(f_sale != undefined) {
    query = {...query, ... { for_sale:f_sale}}
  }
  if(i_raw != undefined) {
    query = {...query, ... { is_raw:i_raw}}
  }
  const list = await ProductType.find(query).limit(15);

  return { status: status.OK, data: { message: "", res: list } };
};
