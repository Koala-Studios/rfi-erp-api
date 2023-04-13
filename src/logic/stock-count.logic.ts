import {
    IListParams,
    ILogicResponse,
} from "./interfaces.logic";
import { reply, status } from "../config/config.status";
import Inventory from "../models/inventory.model";
import StockCount, { IStockCount } from "../models/stock-count.model";
import Formula, { IFormula } from "../models/formula.model";
import { FilterQuery } from "mongoose";
import { IProcessedQuery, processQuery } from "./utils";

//TODO:LISTING PARAMETER GENERALIZING
export const listStockCount = async (
    query:string
  ): Promise<ILogicResponse> => {
    const { _filter, _page, _count }: IProcessedQuery = processQuery(query);

    const list = await StockCount.paginate(_filter, {
      page: _page,
      limit: _count,
      leanWithId: true,
      // sort: { date_created: 'desc' }
  
    });

    return { status: status.OK, data: { message: null, res: list } };
  };
  

export const createStockCount = async (
    createInfo: IStockCount
): Promise<ILogicResponse> => {
    const _stockCount = new StockCount(createInfo);

    _stockCount.save();

    return {
        status: status.CREATED,
        data: { message: "Batch Created", res: _stockCount },
    };
};

