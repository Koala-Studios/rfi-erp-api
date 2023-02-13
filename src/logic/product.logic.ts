import Product, { IProduct } from "../models/product.model";
import { IListParams, IListResponse, ILogicResponse } from "./interfaces.logic";
import { reply, status } from "../config/config.status";
import { createBOM } from "./batching.logic";

export const listProduct = async (
  listParams: IListParams, approved = null
): Promise<ILogicResponse> => {

    //TODO: Add filters to the query with pagination

    /*
    !OLD QUERY:
    
    @Request() req: eRequest,
    @Query() approved: boolean,
    @Query() page: string,
    @Query() count: string
  ) {
    const _page = parseInt(<string>page);
    const _count = parseInt(<string>count);
    const _products = await Product.find(approved ? {is_raw_mat:false, status:4} : {is_raw_mat:false, status: {$ne: 4}})
    .sort({date_created:-1})
    .skip((_page-1) * _count)
    .limit(25);
    */
  const list = await Product.paginate(
    { is_raw:false, status: approved ? 4 : {$ne: 4}}, //filters
    { page: listParams.page, limit: 20, leanWithId: true}
  );
  return {
    status: status.OK,
    data: { message: "", res: list },
  };
};