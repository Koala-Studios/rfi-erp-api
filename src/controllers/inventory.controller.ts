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
    @Query() page: string,
    @Query() count: string,
    @Query() query: string
  ) {
    const _page = parseInt(<string>page);
    const _count = parseInt(<string>count);

    console.log(query, JSON.parse(query));

    const res = await listInventory({
      page: _page,
      count: _count,
      filter: query,
    });
    this.setStatus(res.status);

    return res.data;
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

  @Post("create")
  @SuccessResponse(status.CREATED, reply.success)
  public async createInventoryRequest(
    @Request() req: eRequest,
    @Body() body: ICreateInventoryRequest
  ) {
    const _inventory = new Inventory(<IInventory>{
      name: body.name,
    });

    _inventory.save();

    this.setStatus(status.CREATED);
    return _inventory;
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
