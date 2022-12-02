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
import { getPO, listPurchases } from "../logic/purchase.logic";



@Route("purchase-orders")
@Tags("PurchaseOrder")
@Security("jwt")
export class PurchaseController extends Controller {
    @Get("list")
    @SuccessResponse(status.OK, reply.success)
    public async listPurchasesRequest(
    @Request() req: eRequest,
    @Query() page: string,
    @Query() count: string
  ) {
      const _page = parseInt(<string>page);
      const _count = parseInt(<string>count);
      //filters: all
      const res = await listPurchases({
        page: _page,
        count: _count,
        filter: "" });
      this.setStatus(res.status);
      return res.data;
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