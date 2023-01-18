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
import Supplier, {ISupplier} from "../models/supplier.model";
import { reply, status } from "../config/config.status";
import { listSupplier } from "../logic/supplier.logic";

@Route("suppliers")
@Tags("Suppliers")
@Security("jwt")
export class SupplierController extends Controller {
    @Get("list")
  @SuccessResponse(status.OK, reply.success)
  public async listSupplierRequest(
    @Request() req: eRequest,
    @Query() page: string,
    @Query() count: string
  ) {
    const _page = parseInt(<string>page);
    const _count = parseInt(<string>count);

    const res = await listSupplier({
      page: _page,
      count: _count,
      filter: "" });
    this.setStatus(res.status);
    return res.data;
  }  
  
  @Get("get")
  @SuccessResponse(status.OK, reply.success)
  public async getSupplierRequest(
    @Request() req: eRequest,
    @Query() id: string,
  ) {

    const _supplier = await Supplier.findById(id);
    // console.log(_supplier,id)

    this.setStatus(status.OK);
    return _supplier;
  }

  
  @Post("create")
  @SuccessResponse(status.CREATED, reply.success)
  public async createSupplierRequest(
    @Request() req: eRequest,
    @Body() body: ISupplier
  ) {
    const mongoose = require("mongoose");
    body._id = new mongoose.Types.ObjectId();
    const newSupplier = new Supplier(body);
    newSupplier.save();
    console.log("create", newSupplier);
    this.setStatus(status.CREATED);
    return newSupplier._id;
  }

  @Post("update")
  @SuccessResponse(status.OK, reply.success)
  public async updateSupplierRequest(
    @Request() req: eRequest,
    @Body() s: ISupplier
  ) {
    console.log("update", s);
    await Supplier.findOneAndUpdate({ _id: s._id }, s);

    this.setStatus(status.OK);
    return true;
  }


}