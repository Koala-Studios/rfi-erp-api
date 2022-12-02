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