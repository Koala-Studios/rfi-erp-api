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
import Inventory, { IInventory } from "../models/inventory.model";
import { reply, status } from "../config/config.status";
import { inventoryLookup, listInventory } from "../logic/inventory.logic";
import ProductType, {IProductType} from "../models/product-type.model";
import { generateProductCode } from "../logic/utils";
interface ICreateInventoryRequest {
  name: string;
}

@Route("inventory")
@Tags("Inventory")
@Security("jwt")
export class InventoryController extends Controller {
  @Get("list")
  @SuccessResponse(status.OK, reply.success)
  public async listInventoryRequest(
    @Request() req: eRequest,
    @Query() query: string
  ) {
    const res = await listInventory(query);
    this.setStatus(res.status);

    return res.data;
  }



  @Get("get")
  @SuccessResponse(status.OK, reply.success)
  public async getInventory(
    @Request() req: eRequest,
    @Query() id: string,
  ) {

    const _inventory = await Inventory.findById(id);

    this.setStatus(status.OK);
    return _inventory;
  }


  @Post("create")
  @SuccessResponse(status.CREATED, reply.success)
  public async createInventoryRequest(
    @Request() req: eRequest,
    @Body() body: IInventory
  ) {
    const mongoose = require("mongoose");
    const product_type = await ProductType.findById(body.product_type._id);
    product_type.total +=1;
    product_type.save();
    body._id = new mongoose.Types.ObjectId();
    body.product_code = await generateProductCode(product_type.total,product_type.code);
    body.for_sale = product_type.for_sale;
    body.is_raw = product_type.is_raw;
    const newInventory = await Inventory.create(body);
    this.setStatus(status.CREATED);
  return newInventory;
  }

  @Post("update")
  @SuccessResponse(status.OK, reply.success)
  public async updateInventoryRequest(
    @Request() req: eRequest,
    @Body() i: IInventory
  ) {
    console.log("update", i);
    await Inventory.findOneAndUpdate({ _id: i._id }, i, {new: true});

    this.setStatus(status.OK);
    return true;
  }

  @Get("lookup")
  @SuccessResponse(status.OK, reply.success)
  public async inventoryLookupRequest(
    @Request() req: eRequest,
    @Query() search_value: string,
    @Query() for_sale?: boolean,
    @Query() is_raw?: boolean,
    @Query() approved?: boolean
  ) {

    const res = await inventoryLookup(search_value, for_sale, is_raw , approved)
      //  is_raw, approved);
    this.setStatus(res.status);

    return res.data;
  }
  
  @Post("delete")
  @SuccessResponse(status.OK, reply.success)
  public async deleteInventory(@Query() inventoryId: string) {
    Inventory.deleteOne({ _id: inventoryId });
  }

  @Put("edit")
  @SuccessResponse(status.OK, reply.success)
  public async editInventory() {}
}
