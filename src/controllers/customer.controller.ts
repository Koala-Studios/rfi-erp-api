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
import Customer, { ICustomer } from "../models/customer.model";
import { reply, status } from "../config/config.status";
import { customerLookup, listCustomer } from "../logic/customer.logic";
import mongoose from "mongoose";

@Route("customers")
@Tags("Customers")
@Security("jwt")
export class CustomerController extends Controller {
  @Get("list")
  @SuccessResponse(status.OK, reply.success)
  public async listCustomerRequest(
    @Request() req: eRequest,
    @Query() page: string,
    @Query() count: string
  ) {
    const _page = parseInt(<string>page);
    const _count = parseInt(<string>count);

    const res = await listCustomer({
      page: _page,
      count: _count,
      filter: "",
    });
    this.setStatus(res.status);
    return res.data;
  }

  @Get("get")
  @SuccessResponse(status.OK, reply.success)
  public async getCustomerRequest(
    @Request() req: eRequest,
    @Query() id: string
  ) {
    const res = await Customer.findById(id);
    // console.log(_supplier,id)

    this.setStatus(status.OK);
    return res;
  }

  @Post("create")
  @SuccessResponse(status.OK, reply.success)
  public async createCustomerRequest(
    @Request() req: eRequest,
    @Body() body: ICustomer
  ) {
    body._id = new mongoose.Types.ObjectId();
    const newCustomer = await Customer.create(body);

    this.setStatus(status.CREATED);
    return newCustomer._id;
  }

  @Get("lookup")
  @SuccessResponse(status.OK, reply.success)
  public async customerLookupRequest(
    @Request() req: eRequest,
    @Query() search_value: string
  ) {
    const res = await customerLookup(search_value);
    this.setStatus(res.status);

    return res.data;
  }
}
