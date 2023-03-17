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
import Batching, { IBatching } from "../models/Batching.model";
import { reply, status } from "../config/config.status";
import Inventory, { IInventory } from "../models/inventory.model";
import {
  createBOM,
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
    console.log("batching query", query);
    const res = await listBatching(query);
    this.setStatus(res.status);
    return res.data;
  }


  @Get("get")
  @SuccessResponse(status.OK, reply.success)
  public async getFormulaRequest(
    @Request() req: eRequest,
    @Query() id: string,
  ) {
    console.log(id, 'THIS IS ID SENT')
    const _res = await getBatching(id);

    this.setStatus(status.OK);
    console.log(_res)
    return _res.data;
  }



  @Post("create")
  @SuccessResponse(status.CREATED, reply.success)
  public async createBatchingRequest(
    @Request() req: eRequest,
    @Body() body: IBatching
  ) {
    body._id = new mongoose.Types.ObjectId();
    body.ingredients = [];
    body.date_created = new Date();
    const _batching = new Batching(body);
    _batching.save();
    this.setStatus(status.CREATED);
    return _batching._id;
  }

  @Post("update")
  @SuccessResponse(status.OK, reply.success)
  public async updateProjectRequest(
    @Request() req: eRequest,
    @Body() p: IBatching
  ) {
    await Batching.findOneAndUpdate({ _id: p._id }, p);

    this.setStatus(status.OK);
    return true;
  }



  @Post("generate-bom")
  @SuccessResponse(status.CREATED, reply.success)
  public async createBOMRequest(
    @Request() req: eRequest,
    @Query() batching_id,
  ) {
    const _batching = await Batching.findById(batching_id)
    const _res = await createBOM(_batching);
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
