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
import Application, { IApplication } from "../models/application.model";
import { reply, status } from "../config/config.status";
import { ApplicationLookup, listApplication } from "../logic/application.logic";

@Route("applications")
@Tags("Applications")
@Security("jwt")
export class ApplicationController extends Controller {
  @Get("list")
  @SuccessResponse(status.OK, reply.success)
  public async listApplicationRequest(
    @Request() req: eRequest,
    @Query() query: string
  ) {
    const res = await listApplication(query);
    this.setStatus(res.status);
    return res.data;
  }

  @Get("get")
  @SuccessResponse(status.OK, reply.success)
  public async getApplicationRequest(
    @Request() req: eRequest,
    @Query() id: string
  ) {
    const res = await Application.findById(id);
    this.setStatus(status.OK);
    return res;
  }

  @Get("lookup")
  @SuccessResponse(status.OK, reply.success)
  public async ApplicationLookupRequest(
    @Request() req: eRequest,
    @Query() search_value: string
  ) {
    const res = await ApplicationLookup(search_value);
    this.setStatus(res.status);
    console.log(res.data);
    return res.data;
  }

  @Post("create")
  @SuccessResponse(status.CREATED, reply.success)
  public async createApplicationRequest(
    @Request() req: eRequest,
    @Body() body: IApplication
  ) {
    const mongoose = require("mongoose");
    body._id = new mongoose.Types.ObjectId();
    const newApplication = new Application(body);
    newApplication.save();
    this.setStatus(status.CREATED);
    return newApplication._id;
  }

  @Post("update")
  @SuccessResponse(status.OK, reply.success)
  public async updateApplicationRequest(
    @Request() req: eRequest,
    @Body() a: IApplication
  ) {
    await Application.findOneAndUpdate({ _id: a._id }, a);

    this.setStatus(status.OK);
    return true;
  }
}
