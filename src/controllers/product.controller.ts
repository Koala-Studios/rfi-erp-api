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
import Product, {IProduct} from "../models/product.model";
import { reply, status } from "../config/config.status";
import { listProduct } from "../logic/product.logic";
import ProductType, {IProductType} from "../models/product-type.model";
import { generateProductCode } from "../logic/utils";

interface ICreateProductRequest{
    name:string;
}

@Route("products")
@Tags("Products")
@Security("jwt")
export class ProductController extends Controller {
    @Get("list")
  @SuccessResponse(status.OK, reply.success)
  public async listProductRequest(
    @Request() req: eRequest,
    @Query() page: string,
    @Query() count: string,
    @Query() approved?: boolean,
  ) {
    const _page = parseInt(<string>page);
    const _count = parseInt(<string>count);
    const res = await listProduct({
      page: _page,
      count: _count,
      filter: "" }, approved);
    this.setStatus(res.status);
    return res.data;
  }
  
  @Get("get")
  @SuccessResponse(status.OK, reply.success)
  public async getProduct(
    @Request() req: eRequest,
    @Query() id: string,
  ) {

    const _product = await Product.findById(id);

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
    const product_type = await ProductType.findOne({_id: body.product_type._id });
    body._id = new mongoose.Types.ObjectId();    
    const product_code = await generateProductCode(product_type)
    body.product_code = product_code;//TODO: MAKING SURE NO DUPLICATES PROPERLY!
    body.for_sale = product_type.for_sale;
    body.is_raw = product_type.is_raw;
    const newProduct = new Product(body);
    newProduct.save();
    this.setStatus(status.CREATED);
    return newProduct._id;
  }

  @Post("update")
  @SuccessResponse(status.OK, reply.success)
  public async updateProjectRequest(
    @Request() req: eRequest,
    @Body() p: IProduct
  ) {
    console.log("update", p);
    await Product.findOneAndUpdate({ _id: p._id }, p);

    this.setStatus(status.OK);
    return true;
  }
}
