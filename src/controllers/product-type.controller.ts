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
import ProductType, { IProductType } from "../models/product-type.model";
import { reply, status } from "../config/config.status";
import { productTypeLookup, listProductType } from "../logic/product-type.logic";
import mongoose from "mongoose";

@Route("product-types")
@Tags("ProductTypes")
@Security("jwt")
export class ProductTypeController extends Controller {
  @Get("list")
  @SuccessResponse(status.OK, reply.success)
  public async listProductTypeRequest(
    @Request() req: eRequest,
    @Query() page: string,
    @Query() count: string
  ) {
    const _page = parseInt(<string>page);
    const _count = parseInt(<string>count);

    const res = await listProductType({
      page: _page,
      count: _count,
      filter: "",
    });
    this.setStatus(res.status);
    return res.data;
  }

  @Get("get")
  @SuccessResponse(status.OK, reply.success)
  public async getProductTypeRequest(
    @Request() req: eRequest,
    @Query() id: string
  ) {
    const res = await ProductType.findById(id);
    // console.log(_supplier,id)

    this.setStatus(status.OK);
    return res;
  }

  @Get("lookup")
  @SuccessResponse(status.OK, reply.success)
  public async productTypeLookupRequest(
    @Request() req: eRequest,
    @Query() search_value: string,
    @Query() f_sale: boolean
  ) {
    const res = await productTypeLookup(search_value,f_sale);
    this.setStatus(res.status);
    console.log(res.data)
    return res.data;
  }

  
@Post("create")
@SuccessResponse(status.CREATED, reply.success)
public async createProductTypeRequest(
  @Request() req: eRequest,
  @Body() body: IProductType
) {
  const mongoose = require("mongoose");
  body._id = new mongoose.Types.ObjectId();
  const newProductType = new ProductType(body);
  newProductType.save();
  console.log("create", newProductType);
  this.setStatus(status.CREATED);
  return newProductType._id;
}

@Post("update")
@SuccessResponse(status.OK, reply.success)
public async updateProductTypeRequest(
  @Request() req: eRequest,
  @Body() p: IProductType
) {
  console.log("update", p);
  await ProductType.findOneAndUpdate({ _id: p._id }, p);

  this.setStatus(status.OK);
  return true;
}


}