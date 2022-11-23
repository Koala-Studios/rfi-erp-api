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
import PurchaseOrder, {IPurchaseOrder} from "../models/purchace-order.model";
import { reply, status } from "../config/config.status";



@Route("purchase-orders")
@Tags("PurchaseOrder")
@Security("jwt")
export class PurchaseController extends Controller {
    @Get("list")
    @SuccessResponse(status.OK, reply.success)
    public async listPurchases(@Request() req: eRequest) {
        //filters: all
        const _purchase_order = await PurchaseOrder.find({}).limit(25); 
        console.log(_purchase_order)
        this.setStatus(status.OK);
        return _purchase_order;
    }
}