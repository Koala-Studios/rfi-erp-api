import { ILogicResponse } from "./interfaces.logic";
import { reply, status } from "../config/config.status";
import Formula, { IFormula } from "../models/formula.model";
import Inventory from "../models/inventory.model";
import mongoose from "mongoose";

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
