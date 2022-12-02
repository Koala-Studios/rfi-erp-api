import Customer, { ICustomer } from "../models/customer.model";
import { IListParams, IListResponse, ILogicResponse } from "./interfaces.logic";
import { reply, status } from "../config/config.status";


export const listCustomer = async (
    listParams: IListParams
  ): Promise<ILogicResponse> => {
    const list = await Customer.paginate(
      {},
      { page: listParams.page, limit: listParams.count, leanWithId: true }
    );
  
    return {
      status: status.OK,
      data: { message: "", res: list },
    };
  };