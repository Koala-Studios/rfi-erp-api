import { Tags } from "@tsoa/runtime";
import { Post } from "@tsoa/runtime";
import { Put } from "@tsoa/runtime";
import { Body } from "@tsoa/runtime";
import {
  Controller,
  Get,
  Request,
  Route,
  Security,
  SuccessResponse,
} from "@tsoa/runtime";
import { Request as eRequest } from "express";
import { Query } from "tsoa";
import QualityControl, { IQualityControl } from "../models/qc.model";
import { reply, status } from "../config/config.status";
import { getQualityControl, listQualityControl } from "../logic/qc.logic";

@Route("qc")
@Tags("QualityControl")
@Security("jwt")
export class QualityControlController extends Controller {
  @Get("list")
  @SuccessResponse(status.OK, reply.success)
  public async listQualityControlRequest(
    @Request() req: eRequest,
    @Query() query: string
  ) {
    const res = await listQualityControl(query);
    this.setStatus(res.status);
    return res.data;
  }

  @Get("get")
  @SuccessResponse(status.OK, reply.success)
  public async getQualityControlRequest(
    @Request() req: eRequest,
    @Query() location_id: string
  ) {
    const res = await getQualityControl(location_id);
    this.setStatus(res.status);

    return res.data;
  }

  @Post("create")
  @SuccessResponse(status.CREATED, reply.success)
  public async createQualityControlRequest(
    @Request() req: eRequest,
    @Body() body: IQualityControl
  ) {
    const mongoose = require("mongoose");
    body._id = new mongoose.Types.ObjectId();
    const newQualityControl = new QualityControl(body);

    newQualityControl.save();
    this.setStatus(status.CREATED);
    return newQualityControl._id;
  }

  @Post("update")
  @SuccessResponse(status.OK, reply.success)
  public async updateQualityControlRequest(
    @Request() req: eRequest,
    @Body() u: IQualityControl
  ) {
    await QualityControl.findOneAndUpdate({ _id: u._id }, u); //TODO: remove findoneandupdate and similar functions as they bypass the mongoose type checks

    this.setStatus(status.OK);
    return true;
  }
}
