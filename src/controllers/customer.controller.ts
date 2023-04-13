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
    @Query() query: string
  ) {
    const res = await listCustomer(query);
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

  
@Post("create")
@SuccessResponse(status.CREATED, reply.success)
public async createCustomerRequest(
  @Request() req: eRequest,
  @Body() body: ICustomer
) {
  const mongoose = require("mongoose");
  body._id = new mongoose.Types.ObjectId();
  const newCustomer = new Customer(body);
  newCustomer.save();
  console.log("create", newCustomer);
  this.setStatus(status.CREATED);
  return newCustomer._id;
}

@Post("update")
@SuccessResponse(status.OK, reply.success)
public async updateCustomerRequest(
  @Request() req: eRequest,
  @Body() c: ICustomer
) {
  console.log("update", c);
  await Customer.findOneAndUpdate({ _id: c._id }, c);

  this.setStatus(status.OK);
  return true;
}


}