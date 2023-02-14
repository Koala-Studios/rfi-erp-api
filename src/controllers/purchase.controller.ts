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
import PurchaseOrder, {IOrderItemProcess, IPurchaseOrder, orderStatus} from "../models/purchase-order.model";
import { reply, status } from "../config/config.status";
import { getPO, listPurchases, proccessPurchaseRow, confirmPurchase, setAsReceivedOrCancelled } from "../logic/purchase.logic";
import { InventoryController } from "./inventory.controller";



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


    
  @Post("create")
  @SuccessResponse(status.CREATED, reply.success)
  public async createPurchaseRequest(
    @Request() req: eRequest,
    @Body() body: IPurchaseOrder
  ) {
    const mongoose = require("mongoose");
    body._id = new mongoose.Types.ObjectId();
    const newPurchase = new PurchaseOrder(body);
    newPurchase.save();
    console.log("create", newPurchase);
    this.setStatus(status.CREATED);
    return newPurchase._id;
  }

  @Post("update")
  @SuccessResponse(status.OK, reply.success)
  public async updatePurchaseRequest(
    @Request() req: eRequest,
    @Body() p: IPurchaseOrder
  ) {
    console.log("update", p);
    if (p.status != orderStatus.ABANDONED && p.status != orderStatus.RECEIVED && p.status != orderStatus.DRAFT) {
      const shippingSet = p.shipping_code != null && p.shipping_code != ""
      p.status = shippingSet ? orderStatus.AWAITING_ARRIVAL : orderStatus.AWAITING_SHIPPING
    }
    await PurchaseOrder.findOneAndUpdate({ _id: p._id }, p);

    this.setStatus(status.OK);
    return true;
  }

  @Post("confirm-purchase")
  @SuccessResponse(status.OK, reply.success)
  public async confirmOrderRequest(
    @Request() req: eRequest,
    @Body() purchase: IPurchaseOrder,
  ) {
    const res = await confirmPurchase(purchase);
    this.setStatus(res.status);
    return res.data.res;
  }

  @Post("mark-received")
  @SuccessResponse(status.OK, reply.success)
  public async markPurchaseReceived(
    @Request() req: eRequest,
    @Query() po_id:string,
  ) {
    const res = await setAsReceivedOrCancelled(po_id,true);
    this.setStatus(res.status);
    return res.data.res;
  }

  @Post("mark-cancelled")
  @SuccessResponse(status.OK, reply.success)
  public async markPurchaseCancelled(
    @Request() req: eRequest,
    @Query() po_id:string,
  ) {
    const res = await setAsReceivedOrCancelled(po_id,false);
    this.setStatus(res.status);
    return res.data.res;
  }


  @Post("receive-item")
  @SuccessResponse(status.OK, reply.success)
  public async receivePurchaseItemRequest(
    @Request() req: eRequest,
    @Body() item: IOrderItemProcess,
    @Query() quarantine:boolean
  ) {
    const row = await proccessPurchaseRow(item, quarantine)
    console.log(item, quarantine, 'TEST I GUESS')
    this.setStatus(status.OK);
    return row;
  }
}

