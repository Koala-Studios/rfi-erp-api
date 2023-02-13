import Supplier, { ISupplier } from "../models/supplier.model";
import { IListParams, IListResponse, ILogicResponse } from "./interfaces.logic";
import { reply, status } from "../config/config.status";


export const listSupplier = async (
    listParams: IListParams
  ): Promise<ILogicResponse> => {
    const list = await Supplier.paginate(
      {},
      { page: listParams.page, limit: listParams.count, leanWithId: true }
    );
  
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
