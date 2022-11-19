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
import Inventory, {IInventory} from "../models/inventory.model";
import { createBatching, listBatching } from "../logic/batching.logic";
import { ICreateBatchingInfo } from "../logic/interfaces.logic";

@Route("batching")
@Tags("Batching")
@Security("jwt")
export class BatchingController extends Controller {
  @Get("list")
  @SuccessResponse(status.OK, reply.success)
  public async listBatchingRequest(
    @Request() req: eRequest,
    @Query() page: string,
    @Query() count: string
  ) {
    const _page = parseInt(<string>page);
    const _count = parseInt(<string>count);

    const _res = await listBatching(_page,_count);

    this.setStatus(_res.status);
    return _res.data;
  }



  @Post("create")
  @SuccessResponse(status.CREATED, reply.success)
  public async createBatchingRequest(
    @Request() req: eRequest,
    @Body() body: ICreateBatchingInfo
  ) {
    const _res = await createBatching(body);

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
