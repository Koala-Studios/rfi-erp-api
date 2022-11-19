import { ILogicResponse } from "./interfaces.logic";
import { reply, status } from "../config/config.status";
import Formula, { IFormula } from "../models/formula.model";
import Inventory from "../models/inventory.model";

let ObjectId = require('mongodb').ObjectId; 

export const getFormula = async (product_id):Promise<ILogicResponse> => {

    let _status:number;

    const test_product_id = new ObjectId( product_id)
    const _formula = await Formula.findOne({product_id :test_product_id,  $max: "version"})
    if(!_formula) {
        _status = status.OK;
      return {status:_status, data:{message:"No Formula Found",res:null}};
    }

    for (let index = 0; index < _formula.formula_items.length; index++) {
      const material_id =  _formula.formula_items[index].material_id;
      const material = await Inventory.findOne({_id: material_id})
      // console.log(material_id, material.name)
      _formula.formula_items[index].material_name = material.name;
    }
    _status = status.OK;

    return {status:_status, data:{message:"Formula Found",res:_formula}};
}
