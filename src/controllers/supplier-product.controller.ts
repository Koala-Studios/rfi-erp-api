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
import SupplierProduct, {
  ISupplierProduct,
} from "../models/supplier-product.model";
import { reply, status } from "../config/config.status";
import {
  listSupplierProduct,
  supplierProductLookup,
} from "../logic/supplier-product.logic";

@Route("supplier-products")
@Tags("SupplierProducts")
@Security("jwt")
export class SupplierProductController extends Controller {
  @Get("list")
  @SuccessResponse(status.OK, reply.success)
  public async listSupplierProductRequest(
    @Request() req: eRequest,
    @Query() query: string,
    @Query() supplier_id?: string,
    @Query() product_id?: string
  ) {
    const res = await listSupplierProduct(query, supplier_id, product_id);
    console.log(
      "product id " + product_id,
      "supplier id " + supplier_id,
      res.data.res.docs,
      "list supplier product"
    );
    this.setStatus(res.status);
    return res.data;
  }

  @Get("get")
  @SuccessResponse(status.OK, reply.success)
  public async getSupplierProductRequest(
    @Request() req: eRequest,
    @Query() id: string
  ) {
    const _supplier = await SupplierProduct.findById(id);
    // console.log(_supplier,id)

    this.setStatus(status.OK);
    return _supplier;
  }

  @Get("lookup")
  @SuccessResponse(status.OK, reply.success)
  public async supplierProductLookupRequest(
    @Request() req: eRequest,
    @Query() search_value: string,
    @Query() customer_id: string
  ) {
    const res = await supplierProductLookup(search_value, customer_id);
    this.setStatus(res.status);

    return res.data;
  }

  @Post("create")
  @SuccessResponse(status.CREATED, reply.success)
  public async createSupplierProductRequest(
    @Request() req: eRequest,
    @Body() body: ISupplierProduct
  ) {
    const mongoose = require("mongoose");
    body._id = new mongoose.Types.ObjectId();
    const newSupplierProduct = new SupplierProduct(body);
    newSupplierProduct.save();
    console.log("create", newSupplierProduct);
    this.setStatus(status.CREATED);
    return newSupplierProduct._id;
  }

  @Post("update")
  @SuccessResponse(status.OK, reply.success)
  public async updateSupplierRequest(
    @Request() req: eRequest,
    @Body() s: ISupplierProduct
  ) {
    console.log("update", s);
    await SupplierProduct.findOneAndUpdate({ _id: s._id }, s);

    this.setStatus(status.OK);
    return true;
  }
}
