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
import { reply, status } from "./config.status";

interface ICreateBatchingRequest {
  quantity: number;
  batch_code: string;
  product_id: string;
}

@Route("batching")
@Tags("Batching")
@Security("jwt")
export class BatchingController extends Controller {
  @Get("list")
  @SuccessResponse(status.OK, reply.success)
  public async listBatching(
    @Request() req: eRequest,
    @Query() page: string,
    @Query() count: string
  ) {
    const _page = parseInt(<string>page);
    const _count = parseInt(<string>count);

    const _batching = await Batching.find()
      .sort({date_created:-1})
      .skip(_page * _count)
      .limit(_count);




    this.setStatus(status.OK);
    return _batching;
  }

  @Post("create")
  @SuccessResponse(status.CREATED, reply.success)
  public async addBatching(
    @Request() req: eRequest,
    @Body() body: ICreateBatchingRequest
  ) {
    const _batching = new Batching(<IBatching>{
      product_id: body.product_id,
      quantity: body.quantity,
      date_created: new Date(),
      batch_code: body.batch_code,
      status: 1,
    });

    _batching.save();

    this.setStatus(status.CREATED);
    return _batching;
  }

  @Post("delete")
  @SuccessResponse(status.OK, reply.success)
  public async deleteBatching(@Query() batchingId: string) {
    Batching.deleteOne({ _id: batchingId });
  }

  @Put("edit")
  @SuccessResponse(status.OK, reply.success)
  public async editBatching() {}
}
