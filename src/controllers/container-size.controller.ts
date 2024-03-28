import { Security } from "@tsoa/runtime";
import { Body } from "@tsoa/runtime";
import { SuccessResponse } from "@tsoa/runtime";
import { Controller } from "@tsoa/runtime";
import { Post } from "@tsoa/runtime";
import { Tags } from "@tsoa/runtime";
import { Get } from "@tsoa/runtime";
import { Query } from "@tsoa/runtime";
import { Route } from "@tsoa/runtime";
import { Request } from "@tsoa/runtime";
import { Request as eRequest, Response } from "express";
import ContainerSize, { IContainerSize } from "../models/container-size.model";
import { reply, status } from "../config/config.status";
import {
  ContainerSizeLookup,
  listContainerSize,
} from "../logic/container-size.logic";

@Route("container-sizes")
@Tags("ContainerSizes")
@Security("jwt")
export class ContainerSizeController extends Controller {
  @Get("list")
  @SuccessResponse(status.OK, reply.success)
  public async listContainerSizeRequest(
    @Request() req: eRequest,
    @Query() query: string
  ) {
    const res = await listContainerSize(query);
    this.setStatus(res.status);
    return res.data;
  }

  @Get("get")
  @SuccessResponse(status.OK, reply.success)
  public async getContainerSizeRequest(
    @Request() req: eRequest,
    @Query() id: string
  ) {
    const res = await ContainerSize.findById(id);
    this.setStatus(status.OK);
    return res;
  }

  @Get("lookup")
  @SuccessResponse(status.OK, reply.success)
  public async ContainerSizeLookupRequest(
    @Request() req: eRequest,
    @Query() search_value: string
  ) {
    const res = await ContainerSizeLookup(search_value);
    this.setStatus(res.status);
    console.log(res.data);
    return res.data;
  }

  @Post("create")
  @SuccessResponse(status.CREATED, reply.success)
  public async createContainerSizeRequest(
    @Request() req: eRequest,
    @Body() body: IContainerSize
  ) {
    const mongoose = require("mongoose");
    body._id = new mongoose.Types.ObjectId();
    const newContainerSize = new ContainerSize(body);
    newContainerSize.save();
    this.setStatus(status.CREATED);
    return newContainerSize._id;
  }

  @Post("update")
  @SuccessResponse(status.OK, reply.success)
  public async updateContainerSizeRequest(
    @Request() req: eRequest,
    @Body() p: IContainerSize
  ) {
    console.log("update", p);
    await ContainerSize.findOneAndUpdate({ _id: p._id }, p);

    this.setStatus(status.OK);
    return true;
  }
}
