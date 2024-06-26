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
  updateProductPrice,
} from "../logic/product.logic";
import ProductType, { IProductType } from "../models/product-type.model";
import { generateProductCode, refreshProductCosts } from "../logic/utils";

@Route("products")
@Tags("Products")
@Security("jwt")
export class ProductController extends Controller {
  @Get("list")
  @SuccessResponse(status.OK, reply.success)
  public async listProductRequest(
    @Request() req: eRequest,
    @Query() query: string,
    @Query() approved?: boolean,
    @Query() for_sale?: boolean
  ) {
    const res = await listProduct(query, approved, for_sale);

    this.setStatus(res.status);
    return res.data;
  }

  @Get("get")
  @SuccessResponse(status.OK, reply.success)
  public async getProduct(@Request() req: eRequest, @Query() id: string) {
    const _product = await Product.findById(id);

    _product.cost = await updateProductPrice(id);
    _product.save();
    this.setStatus(status.OK);
    return _product;
  }

  @Post("create")
  @SuccessResponse(status.CREATED, reply.success)
  public async createProductRequest(
    @Request() req: eRequest,
    @Body() body: IProduct
  ) {
    const mongoose = require("mongoose");
    const product_type = await ProductType.findById(body.product_type._id);
    product_type.total += 1;
    product_type.save();
    body._id = new mongoose.Types.ObjectId();
    body.product_code = await generateProductCode(
      product_type.total,
      product_type.code
    );
    body.for_sale = product_type.for_sale;
    body.is_raw = product_type.is_raw;
    body.avoid_recur = product_type.avoid_recur;
    const newProduct = await Product.create(body);
    this.setStatus(status.CREATED);
    return newProduct;
  }

  @Get("lookup")
  @SuccessResponse(status.OK, reply.success)
  public async productLookupRequest(
    @Request() req: eRequest,
    @Query() search_value: string,
    @Query() for_sale?: boolean,
    @Query() approved?: boolean
  ) {
    const res = await productLookup(search_value, for_sale, approved);
    this.setStatus(res.status);

    return res.data;
  }

  @Get("lookup-list")
  @SuccessResponse(status.OK, reply.success)
  public async lookupListByCode(
    @Request() req: eRequest,
    @Query() code_list: string[]
  ) {
    const products = await productLookupByCode(code_list);
    this.setStatus(status.OK);
    return products;
  }

  @Post("update")
  @SuccessResponse(status.OK, reply.success)
  public async updateProductRequest(
    @Request() req: eRequest,
    @Body() p: IProduct
  ) {
    console.log("update", p);
    await Product.findOneAndUpdate({ _id: p._id }, p);

    this.setStatus(status.OK);
    return true;
  }
}
