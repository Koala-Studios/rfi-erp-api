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
import { reply, status } from "../config/config.status";
import {
  confirmSales,
  getSalesOrder,
  listSalesOrders,
  proccessSalesRow,
} from "../logic/sales.logic";
import SalesOrder, { ISalesOrder } from "../models/sales-order.model";

@Route("sales-orders")
@Tags("SalesOrder")
@Security("jwt")
export class SalesController extends Controller {
  @Get("list")
  @SuccessResponse(status.OK, reply.success)
  public async listSalesRequest(
    @Request() req: eRequest,
    @Query() query: string
  ) {
    //filters: all
    const res = await listSalesOrders(query);
    this.setStatus(res.status);
    return res.data;
  }

  // @Get("list-supplier-orders")
  // @SuccessResponse(status.OK, reply.success)
  // public async listSupplierOrders(
  //   @Request() req: eRequest,
  //   @Query() query: string,
  //   @Query() supplier_id?: string
  // ) {
  //   const res = await listCustomerOrders(query, supplier_id);
  //   this.setStatus(res.status);

  //   return res.data;
  // }

  @Get("get")
  @SuccessResponse(status.OK, reply.success)
  public async getSalesRequest(@Request() req: eRequest, @Query() id: string) {
    const _res = await getSalesOrder(id);

    this.setStatus(_res.status);
    console.log(_res);
    return _res.data;
  }

  @Post("create")
  @SuccessResponse(status.CREATED, reply.success)
  public async createSalesRequest(
    @Request() req: eRequest,
    @Body() body: ISalesOrder
  ) {
    const mongoose = require("mongoose");
    body._id = new mongoose.Types.ObjectId();
    console.log(body, "POTEST");
    const newSales = new SalesOrder(body);
    newSales.save().catch(function (error) {
      //TODO: FIX ALL OF THESE DUP KEY ISSUES AND MOVE CREATE LOGIC TO LOGIC PAGE
      console.log(error);
    });
    this.setStatus(status.CREATED);
    return newSales;
  }

  @Post("update")
  @SuccessResponse(status.OK, reply.success)
  public async updateSalesRequest(
    @Request() req: eRequest,
    @Body() p: ISalesOrder
  ) {
    console.log("update", p);

    await SalesOrder.findOneAndUpdate({ _id: p._id }, p);

    this.setStatus(status.OK);
    return true;
  }

  @Post("confirm-sales")
  @SuccessResponse(status.OK, reply.success)
  public async confirmOrderRequest(
    @Request() req: eRequest,
    @Body() purchase: ISalesOrder
  ) {
    const res = await confirmSales(purchase);
    this.setStatus(res.status);
    return res.data;
  }

  @Post("handle-item")
  @SuccessResponse(status.OK, reply.success)
  public async receivePurchaseItemRequest(
    @Request() req: eRequest,
    @Body() item: any, //IOrderItemProcess, gives route error annoying..
    @Query() order_id: string
  ) {
    const res = await proccessSalesRow(item, order_id);
    this.setStatus(status.OK);
    return res.data;
  }
}
