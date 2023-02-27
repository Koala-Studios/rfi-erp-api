import {
    IListParams,
    ILogicResponse,
} from "./interfaces.logic";
import { reply, status } from "../config/config.status";
import Inventory from "../models/inventory.model";
import StockCount, { IStockCount } from "../models/stock-count.model";
import Formula, { IFormula } from "../models/formula.model";
import { FilterQuery } from "mongoose";

//TODO:LISTING PARAMETER GENERALIZING
export const listStockCount = async (
    listParams: IListParams
): Promise<ILogicResponse> => {
    const query = JSON.parse(listParams.filter) as FilterQuery<IStockCount>;

    const list = await StockCount.paginate(query, {
        page: listParams.page,
        limit: listParams.count,
        leanWithId: true,
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

