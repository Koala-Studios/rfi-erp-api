import { Security } from "@tsoa/runtime";
import { Body } from "@tsoa/runtime";
import { SuccessResponse } from "@tsoa/runtime";
import { Controller } from "@tsoa/runtime";
import { Post } from "@tsoa/runtime";
import { Tags } from "@tsoa/runtime";
import { Get } from "@tsoa/runtime";
import { Query } from "@tsoa/runtime";
import { Put } from "@tsoa/runtime";
import { Route } from "@tsoa/runtime";
import { Request } from "@tsoa/runtime";
import { Request as eRequest, Response } from "express";
import logger from "../logger/logger";
import PurchaseOrder, {IPurchaseOrder} from "../models/purchase-order.model";
import { reply, status } from "../config/config.status";
import { getPO } from "../logic/purchase.logic";



@Route("purchase-orders")
@Tags("PurchaseOrder")
@Security("jwt")
export class PurchaseController extends Controller {
    @Get("list")
    @SuccessResponse(status.OK, reply.success)
    public async listPurchases(@Request() req: eRequest) {
        //filters: all
        const _purchase_order = await PurchaseOrder.find({}).limit(25); 
        this.setStatus(status.OK);
        return _purchase_order;
    }


      
    @Get("get")
    @SuccessResponse(status.OK, reply.success)
    public async getFormulaRequest(
      @Request() req: eRequest,
      @Query() id: string,
    ) {
      const _res = await getPO(id);
      
      this.setStatus(_res.status);
      console.log(_res)
      return _res.data;
    }
}