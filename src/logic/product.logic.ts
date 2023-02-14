import Product, { IProduct } from "../models/product.model";
import { IListParams, IListResponse, ILogicResponse } from "./interfaces.logic";
import { reply, status } from "../config/config.status";
import { createBOM } from "./batching.logic";

export const listProduct = async (
  listParams: IListParams, approved = null
): Promise<ILogicResponse> => {

    //TODO: Add filters to the query with pagination

  const list = await Product.paginate(
    { is_raw:false, status: approved ? 4 : {$ne: 4}}, //filters
    { page: listParams.page, limit: 20, leanWithId: true}
  );
  return {
    status: status.OK,
    data: { message: "", res: list },
  };
};