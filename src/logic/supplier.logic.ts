import Supplier, { ISupplier } from "../models/supplier.model";
import { IListParams, IListResponse, ILogicResponse } from "./interfaces.logic";
import { reply, status } from "../config/config.status";
import { IProcessedQuery, processQuery } from "./utils";


export const listSupplier = async (
    query:string
  ): Promise<ILogicResponse> => {
    const { _filter, _page, _count }: IProcessedQuery = processQuery(query);

    const list = await Supplier.paginate(_filter, {
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

export const supplierLookup = async (s_value) => {
  const searchValue = s_value.toString();
  const list = await Supplier.find({ name: new RegExp(searchValue,"i") }).limit(15);

  return { status: status.OK, data: { message: "", res: list } };
};
