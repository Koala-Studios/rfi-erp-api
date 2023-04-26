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
import StockCount, { IStockCount } from "../models/stock-count.model";
import { reply, status } from "../config/config.status";
import {
  abandonStockCount,
  approveStockCount,
  createStockCount,
  disapproveStockCount,
  listStockCount,
  submitStockCount,
} from "../logic/stock-count.logic";
import mongoose from "mongoose";

@Route("stock-counts")
@Tags("StockCount")
@Security("jwt")
export class StockCountController extends Controller {
  @Get("list")
  @SuccessResponse(status.OK, reply.success)
  public async listStockCountRequest(
    @Request() req: eRequest,
    @Query() query: string
  ) {
    console.log(JSON.parse(query));

    const res = await listStockCount(query);
    this.setStatus(res.status);
    return res.data;
  }

  @Get("get")
  @SuccessResponse(status.OK, reply.success)
  public async getStockCountRequest(
    @Request() req: eRequest,
    @Query() id: string
  ) {
    const _stockCount = await StockCount.findById(id);
    console.log(_stockCount);
    this.setStatus(status.OK);
    return { res: _stockCount, message: "Stock Count" };
  }

  @Post("create")
  @SuccessResponse(status.CREATED, reply.success)
  public async createStockCountRequest(
    @Request() req: eRequest,
    @Body() body: IStockCount
  ) {
    body._id = new mongoose.Types.ObjectId();
    const _res = await createStockCount(body);
    this.setStatus(_res.status);
    return _res.data;
  }

  @Post("update")
  @SuccessResponse(status.OK, reply.success)
  public async updateStockCountRequest(
    @Request() req: eRequest,
    @Body() formData: IStockCount
  ) {
    await StockCount.findOneAndUpdate({ _id: formData._id }, formData);

    this.setStatus(status.OK);
    return true;
  }

  @Post("submit-for-approval")
  @SuccessResponse(status.OK, reply.success)
  public async submitStockCountRequest(
    @Request() req: eRequest,
    @Body() formData:IStockCount
  ) {
    const _res = await submitStockCount(formData._id);

    this.setStatus(_res.status);
    return _res.data;
  }

  @Post("approve")
  @SuccessResponse(status.OK, reply.success)
  public async approveStockCountRequest(
    @Request() req: eRequest,
    @Body() formData:IStockCount
  ) {
    const _res = await approveStockCount(formData._id);

    this.setStatus(_res.status);
    return _res.data;
  }

  @Post("disapprove")
  @SuccessResponse(status.OK, reply.success)
  public async disapproveStockCountRequest(
    @Request() req: eRequest,
    @Body() formData:IStockCount
  ) {
    const _res = await disapproveStockCount(formData._id);

    this.setStatus(_res.status);
    return _res.data;
  }

  @Post("abandon")
  @SuccessResponse(status.OK, reply.success)
  public async abandonStockCountRequest(
    @Request() req: eRequest,
    @Body() formData:IStockCount
  ) {
    const _res = await abandonStockCount(formData._id);

    this.setStatus(_res.status);
    return _res.data;
  }
}
