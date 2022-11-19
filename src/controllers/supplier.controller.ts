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
import { reply, status } from "./config.status";

@Route("suppliers")
@Tags("Suppliers")
@Security("jwt")
export class SupplierController extends Controller {
    @Get("list")
  @SuccessResponse(status.OK, reply.success)
  public async listSupplier(
    @Request() req: eRequest,
    @Query() page: string,
    @Query() count: string
  ) {
    const _page = parseInt(<string>page);
    const _count = parseInt(<string>count);

    const _suppliers = await Supplier.find()
      .skip((_page-1) * _count)
      .limit(_count);
    this.setStatus(status.OK);
    return _suppliers;
  }  
  
  @Get("get")
  @SuccessResponse(status.OK, reply.success)
  public async getSupplier(
    @Request() req: eRequest,
    @Query() id: string,
  ) {

    const _supplier = await Supplier.findById(id);
    // console.log(_supplier,id)

    this.setStatus(status.OK);
    return _supplier;
  }

  @Post("create")
  @SuccessResponse(status.OK, reply.success)
  public async createSupplier(
    @Request() req: ISupplier
  ) {

    const _supplier = await Supplier.create(req);

    this.setStatus(status.OK);
    return _supplier;
  }  
}
