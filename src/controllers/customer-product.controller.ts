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
import Product, { IProduct } from "../models/product.model";
import { reply, status } from "../config/config.status";
import {
  listProduct,
  productLookup,
  productLookupByCode,
} from "../logic/product.logic";
import CustomerProduct, {
  ICustomerProduct,
} from "../models/customer-product.model";
import {
  listCustomerProduct,
  customerProductLookup,
} from "../logic/customer-product.logic";

@Route("customer-products")
@Tags("CustomerProducts")
@Security("jwt")
export class CustomerProductController extends Controller {
  @Get("list")
  @SuccessResponse(status.OK, reply.success)
  public async listCustomerProductRequest(
    @Request() req: eRequest,
    @Query() query: string,
    @Query() customer_id?: string,
    @Query() product_id?: string
  ) {
    const res = await listCustomerProduct(query, customer_id);
    this.setStatus(res.status);
    return res.data;
  }

  @Post("create")
  @SuccessResponse(status.CREATED, reply.success)
  public async createCustomerProductRequest(
    @Request() req: eRequest,
    @Body() body: ICustomerProduct
  ) {
    const mongoose = require("mongoose");
    body._id = new mongoose.Types.ObjectId();
    const newCustomerProduct = new CustomerProduct(body);
    newCustomerProduct.save();
    console.log("create", newCustomerProduct);
    this.setStatus(status.CREATED);
    return newCustomerProduct._id;
  }

  @Get("lookup")
  @SuccessResponse(status.OK, reply.success)
  public async productLookupRequest(
    @Request() req: eRequest,
    @Query() search_value: string,
    @Query() customer_id: string
  ) {
    const res = await customerProductLookup(search_value, customer_id);
    this.setStatus(res.status);

    return res.data;
  }

  @Post("update")
  @SuccessResponse(status.CREATED, reply.success)
  public async updateCustomerProductRequest(
    @Request() req: eRequest,
    @Body() body: ICustomerProduct[]
  ) {
    let message = "Updated Customer Products";
    let _status = true;
    for (const product of body) {
      await CustomerProduct.findOneAndUpdate({ _id: product._id }, product, {
        upsert: true,
      }).catch((e) => {
        message =
          "Not Saved. Error: " +
          e.codeName +
          " | Value: " +
          e.keyValue.customer_sku;
        _status = false;
      });
    }
    this.setStatus(status.OK);
    return { message: message, res: _status };
  }
}
