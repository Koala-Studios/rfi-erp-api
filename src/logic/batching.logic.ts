import { ICreateBatchingInfo, IListParams, ILogicResponse } from "./interfaces.logic";
import { reply, status } from "../config/config.status";
import Inventory from "../models/inventory.model";
import Batching, { IBatching } from "../models/Batching.model";
import Formula, { IFormula } from "../models/formula.model";

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

export const createBOM = async (product_code:string, amount:number):Promise<ILogicResponse> => {
  const materials = await recursiveFinder({product_code, amount})

  console.log(materials, 'THIS IS FINAL')
  return {status:status.CREATED, data:{message:"Batch Created", res: materials}};
}


const recursiveFinder = async (product: {product_code:string, amount:number}) => {
  const materialTypes = ["FL", "FK", "FE", "SM"]; //TODO: make this modular
  const avoidRecursionMatTypes = ["FK"];
  let rawIngredients: {product_code:string, amount:number}[] = [];
  
  const formula = await Formula.findOne({ product_code: product.product_code, $max: "version"});
  // console.log(formula)
  const f = formula.formula_items;

  for (let i = 0; i < f.length; i++) { //TODO: INCOMPLETE
    if (materialTypes.some((substring) => f[i].material_code.startsWith(substring))) { //if not a raw material.
      if((avoidRecursionMatTypes.some((substring) => f[i].material_code.startsWith(substring)))) {
        const inv_material = await Inventory.findOne({product_code: f[i].material_code});
        if(inv_material.stock[0].on_hand - inv_material.stock[0].allocated >= (product.amount * f[i].amount) / 100) { //!MIGRATE TO REMOVE ARRAY AND GET RID OF THESE [0]'s
          // console.log(inv_material.stock[0].on_hand,  inv_material.stock[0].allocated, (product.amount * f[i].amount) / 100, 'HAS ENOUGH' )
          rawIngredients.push({
            product_code: f[i].material_code,
            amount: (product.amount * f[i].amount) / 100,
          });
        } else {
          // console.log(inv_material.stock[0].on_hand,  inv_material.stock[0].allocated, (product.amount * f[i].amount) / 100, 'HAS NOT ENOUGH' + f[i].material_code )
          rawIngredients = [
            ...rawIngredients,
            ...await recursiveFinder({
                product_code: f[i].material_code,
                amount: (product.amount * f[i].amount) / 100,
              }
            ),
          ];
        }
      } else {
        rawIngredients = [
          ...rawIngredients,
          ...await recursiveFinder({
              product_code: f[i].material_code,
              amount: (product.amount * f[i].amount) / 100,
            }
          ),
        ];
      }
    } else {
      rawIngredients.push({
        product_code: f[i].material_code,
        amount: (product.amount * f[i].amount) / 100,
      });
    }
  }

  return rawIngredients;
};