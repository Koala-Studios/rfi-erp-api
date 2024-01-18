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
import Batching, { batchingStatus, IBatching } from "../models/batching.model";
import { reply, status } from "../config/config.status";
import Inventory, { IInventory } from "../models/inventory.model";
import {
  confirmBatching,
  createBatching,
  finishBatching,
  generateBOM,
  getBatching,
  listBatching,
} from "../logic/batching.logic";
import mongoose from "mongoose";

@Route("batching")
@Tags("Batching")
@Security("jwt")
export class BatchingController extends Controller {
  @Get("list")
  @SuccessResponse(status.OK, reply.success)
  public async listBatchingRequest(
    @Request() req: eRequest,
    @Query() query: string
  ) {
    // console.log("batching query", query);
    const res = await listBatching(query);
    this.setStatus(res.status);
    return res.data;
  }

  @Get("get")
  @SuccessResponse(status.OK, reply.success)
  public async getBatchingRequest(
    @Request() req: eRequest,
    @Query() id: string
  ) {
    const _res = await getBatching(id);
    this.setStatus(status.OK);
    return _res.data;
  }

  @Post("create")
  @SuccessResponse(status.CREATED, reply.success)
  public async createBatchingRequest(
    @Request() req: eRequest,
    @Body() body: IBatching
  ) {
    const _res = await createBatching(body);
    this.setStatus(status.CREATED);
    return { message: _res.data.message, res: _res.data.res };
  }

  @Post("update")
  @SuccessResponse(status.OK, reply.success)
  public async updateBatchingRequest(
    @Request() req: eRequest,
    @Body() b: IBatching
  ) {
    await Batching.findOneAndUpdate({ _id: b._id }, b);

    this.setStatus(status.OK);
    return true;
  }

  @Post("confirm")
  @SuccessResponse(status.OK, reply.success)
  public async confirmBatchingRequest(
    @Request() req: eRequest,
    @Body() b: IBatching
  ) {
    const _res = await confirmBatching(b);
    this.setStatus(status.OK);
    return { message: "Successfully Confirmed", res: _res.data.res };
  }

  @Post("generate-bom")
  @SuccessResponse(status.CREATED, reply.success)
  public async createBOMRequest(
    @Request() req: eRequest,
    @Query() batching_id
  ) {
    const _batching = await Batching.findById(batching_id);
    const _res = await generateBOM(_batching);
    this.setStatus(_res.status);
    return _res.data;
  }

  @Post("finish-batching")
  @SuccessResponse(status.CREATED, reply.success)
  public async finishBatchingRequest(
    @Request() req: eRequest,
    @Query() batching_id
  ) {
    const _batching = await Batching.findById(batching_id);
    const _res = await finishBatching(_batching);
    this.setStatus(_res.status);
    return _res.data;
  }

  @Post("delete")
  @SuccessResponse(status.OK, reply.success)
  public async deleteBatching(@Query() batchingId: string) {
    //TODO:MOVE TO LOGIC
    //Batching.deleteOne({ _id: batchingId });
  }

  @Put("edit")
  @SuccessResponse(status.OK, reply.success)
  public async editBatching() {}
}
