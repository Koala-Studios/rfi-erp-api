import { ICreateBatchingInfo, ILogicResponse } from "./interfaces.logic";
import { reply, status } from "../config/config.status";
import Inventory from "../models/inventory.model";
import Batching, { IBatching } from "../models/Batching.model";

//TODO:LISTING PARAMETER GENERALIZING
export const listBatching = async (page:number, count:number):Promise<ILogicResponse> => {

    const _batching = await Batching.find()
      .sort({date_created:-1})
      .skip((page-1) * count)
      .limit(count);

    
    for (let index = 0; index < _batching.length; index++) {
      const material_id =  _batching[index].product_id;

      const product = await Inventory.findOne({_id: material_id})
      // console.log(material_id, material.name)
      _batching[index].product_name = product.name;
    }

    return {status:status.OK, data:{message:null, res:_batching}};
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