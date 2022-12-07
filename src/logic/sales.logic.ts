import { reply, status } from "../config/config.status";
import SalesOrder, { ISalesOrder } from "../models/sales-order.model";
import Inventory from "../models/inventory.model";
import mongoose from "mongoose";
import { IListParams, IListResponse, ILogicResponse } from "./interfaces.logic";
let ObjectId = require('mongodb').ObjectId;


export const listSalesOrders = async (
    listParams: IListParams
  ): Promise<ILogicResponse> => {
    const list = await SalesOrder.paginate(
      {},
      { page: listParams.page, limit: listParams.count, leanWithId: true }
    );
  
    return {
      status: status.OK,
      data: { message: "", res: list },
    };
  };


export const getSalesOrder = async (po_id):Promise<ILogicResponse> => {

    let _status:number;

    const p_id = new ObjectId( po_id)

   const _sales_order = await SalesOrder.aggregate(
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
                                    "$$ingredients.material_id"
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
                                            "material_name" : "$$m.name"
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
    if(!_sales_order[0]) {
        _status = status.OK;
      return {status:_status, data:{message:"No Sales Order Found",res:null}};
    }
    _status = status.OK;

    return {status:_status, data:{message:"Sales Order",res:_sales_order[0]}};
}


export const updateSalesItem = async (placeholder):Promise<ILogicResponse> => {

    //remember there's 
    //send to QC or receive into inventory

    return {status: null, data:{message: null,res: null}};
}

