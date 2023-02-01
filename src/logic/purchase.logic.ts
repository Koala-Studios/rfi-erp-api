import { reply, status } from "../config/config.status";
import PurchaseOrder, { IPurchaseOrder } from "../models/purchase-order.model";
import Inventory from "../models/inventory.model";
import mongoose from "mongoose";
import { IListParams, IListResponse, ILogicResponse } from "./interfaces.logic";
let ObjectId = require('mongodb').ObjectId;


export const listPurchases = async (
    listParams: IListParams
  ): Promise<ILogicResponse> => {
    const list = await PurchaseOrder.paginate(
      {},
      { page: listParams.page, limit: listParams.count, leanWithId: true }
    );
  
    return {
      status: status.OK,
      data: { message: "", res: list },
    };
  };


export const getPO = async (po_id):Promise<ILogicResponse> => {

    let _status:number;

    const p_id = new ObjectId( po_id)

   const _purchase_order = await PurchaseOrder.aggregate(
    [
        {
            "$match" :{
                "_id" : p_id ,
            },

        },
        {
            "$lookup" : {
                "from" : "inventory",
                "let" : {
                    "ingredients" : "$order_items"
                },
                "pipeline" : [
                    {
                        "$match" : {
                            "$expr" : {
                                "$in" : [
                                    "$_id",
                                    "$$ingredients.product_id"
                                ]
                            }
                        }
                    },
                    {
                        "$project" : {
                            "name" : 1.0
                        }
                    }
                ],
                "as" : "order_info"
            }
        }, 
        {
            "$addFields" : {
                "order_items" : {
                    "$map" : {
                        "input" : "$order_items",
                        "in" : {
                            "$let" : {
                                "vars" : {
                                    "m" : {
                                        "$arrayElemAt" : [
                                            {
                                                "$filter" : {
                                                    "input" : "$order_info",
                                                    "cond" : {
                                                        "$eq" : [
                                                            "$$mb._id",
                                                            "$$this.product_id"
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
                                            "product_name" : "$$m.name"
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
                "order_info"
            ]
        }
    ], 
    {
        "allowDiskUse" : false
    }
);
    if(!_purchase_order[0]) {
        _status = status.OK;
      return {status:_status, data:{message:"No Purchase Order Found",res:null}};
    }
    _status = status.OK;

    return {status:_status, data:{message:"Purchase Order",res:_purchase_order[0]}};
}


export const updatePurchaseItem = async (placeholder):Promise<ILogicResponse> => {

    //remember there's 
    //send to QC or receive into inventory

    return {status: null, data:{message: null,res: null}};
}

