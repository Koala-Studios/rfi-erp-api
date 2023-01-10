import { reply, status } from "../config/config.status";
import Formula, { IFormula } from "../models/formula.model";
import Product from "../models/product.model";
import Inventory from "../models/inventory.model";
import mongoose from "mongoose";
import { IFormulaSubmitInfo, ILogicResponse } from "./interfaces.logic";

let ObjectId = require('mongodb').ObjectId; 
export const getFormula = async (product_id, version):Promise<ILogicResponse> => {

    let _status:number;

    const p_id = new ObjectId( product_id)
    const ver = parseInt(version);

   const _formula = await Formula.aggregate(
    [
        {
            "$match" : {    "$and":[
                {"product_id" : p_id },
                {"version" : ver} ]
            },

        },
        // { $limit : 1},
        {
            "$lookup" : {
                "from" : "inventory",
                "let" : {
                    "ingredients" : "$formula_items"
                },
                "pipeline" : [
                    {
                        "$match" : {
                            "$expr" : {
                                "$in" : [
                                    "$_id",
                                    "$$ingredients.material_id"
                                ]
                            }
                        }
                    },
                    {
                        "$project" : {
                            "name" : 1.0,
                            "cost" : 1.0
                        }
                    }
                ],
                "as" : "ing_info"
            }
        }, 
        {
            "$addFields" : {
                "formula_items" : {
                    "$map" : {
                        "input" : "$formula_items",
                        "in" : {
                            "$let" : {
                                "vars" : {
                                    "m" : {
                                        "$arrayElemAt" : [
                                            {
                                                "$filter" : {
                                                    "input" : "$ing_info",
                                                    "cond" : {
                                                        "$eq" : [
                                                            "$$mb._id",
                                                            "$$this.material_id"
                                                        ]
                                                    },
                                                    "as" : "mb"
                                                }
                                            },
                                            0.0
                                        ]
                                    }
                                },
                                "in" : {
                                    "$mergeObjects" : [
                                        "$$this",
                                        {
                                            "material_name" : "$$m.name",
                                            "cost" : "$$m.cost"
                                        }
                                    ]
                                }
                            }
                        }
                    }
                }
            }
        },
        {
            "$unset" : [
                "ing_info"
            ]
        }
    ], 
    {
        "allowDiskUse" : false
    }
);
    if(!_formula[0]) {
        _status = status.OK;
      return {status:_status, data:{message:"No Formula Found",res:null}};
    }
    _status = status.OK;
    return {status:_status, data:{message:"Formula Found",res:_formula[0]}};
}




export const submitFormula = async (submitInfo: IFormulaSubmitInfo):Promise<ILogicResponse> => {

    let _status:number;
    let _message:string;

    //TODO: implement check for FDA status in ingredients vs in product
    let product = await Product.findById(submitInfo.product_id);

    //!If product is already approved
    if(product.status == 4) {
        _status = status.FORBIDDEN;
        _message = "Product is already approved!";
        return {status:_status,data:{message:_message,res:null}};
    }

    product.versions+= 1;

    //*If flavorist is setting product as ready for approval
    if(submitInfo.approved) {
        product.status = 3;
        _message = "Formula Submitted & Ready For Approval!";
    } else {
        _message = "Formula Submitted!";
    }
    
    const newDevelopment = new Formula(<IFormula>{
        product_code: product.product_code,
        version: product.versions,
        date_created: new Date(),
        formula_items: submitInfo.formula_items
    });

    newDevelopment.save();
    product.save();

    _status = status.OK;

    return {status:_status, data:{message:_message,res:newDevelopment}};
}

//R&D Manager Approval
export const approveFormula = async (submitInfo: IFormulaSubmitInfo):Promise<ILogicResponse> => {

    
    return {status: null, data:{message: null,res: null}};
}