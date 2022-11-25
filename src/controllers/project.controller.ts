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

interface ICreateProductRequest{
    name:string;
}

@Route("projects")
@Tags("Projects")
@Security("jwt")
export class ProjectController extends Controller {
    @Get("list")
  @SuccessResponse(status.OK, reply.success)
  public async listProject(
    @Request() req: eRequest,
    @Query() approved: boolean,
    @Query() page: string,
    @Query() count: string
  ) {
    const _page = parseInt(<string>page);
    const _count = parseInt(<string>count);
    // const _products = await Product.find(approved ? {is_raw_mat:false, status:4} : {is_raw_mat:false, status: {$ne: 4}})
    // .sort({date_created:-1})
    // .skip((_page-1) * _count)
    // .limit(25);
    // console.log(_products)
    this.setStatus(status.OK);
    return [];
  }  
  
  @Get("get")
  @SuccessResponse(status.OK, reply.success)
  public async getProject(
    @Request() req: eRequest,
    @Query() id: string,
  ) {
    // console.log(_product,id)

    this.setStatus(status.OK);
    return {status:status.OK, data:{message:"Project Details",res:[]}};
  }
}
