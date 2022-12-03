import { ICreateBatchingInfo, IListParams, ILogicResponse } from "./interfaces.logic";
import { reply, status } from "../config/config.status";
import Inventory from "../models/inventory.model";
import Batching, { IBatching } from "../models/Batching.model";

//TODO:LISTING PARAMETER GENERALIZING
export const listBatching = async (
  listParams: IListParams
): Promise<ILogicResponse> => {

      const list = await Batching.paginate(
        {},
        { page: listParams.page, limit: listParams.count, leanWithId: true }
      );

    

      //TODO: REMOVE THIS LMAO
    for (let index = 0; index < list.docs.length; index++) {
      const material_id =  list.docs[index].product_id;

      const product = await Inventory.findOne({_id: material_id})
      list.docs[index].product_name = product.name;
    }

    return {status:status.OK, data:{message:null, res:list}};
}

export const createBatching = async (createInfo:ICreateBatchingInfo):Promise<ILogicResponse> => {

    const _batching = new Batching(<IBatching>{
        product_id: createInfo.product_id,
        quantity: createInfo.quantity,
        date_created: new Date(),
        batch_code: createInfo.batch_code,
        status: 1,
      });
  
      _batching.save();
  
      return {status:status.CREATED, data:{message:"Batch Created", res:_batching}};

}