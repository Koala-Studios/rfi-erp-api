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
import InventoryStock, { IInventoryStock } from "../models/inventory-stock.model";
import { reply, status } from "../config/config.status";
import { inventoryStockLookup, listInventoryStockGrouped } from "../logic/inventory-stock.logic";

interface ICreateInventoryStockRequest {
  name: string;
}

@Route("inventory-stock")
@Tags("InventoryStock")
@Security("jwt")
export class InventoryStockStockController extends Controller {
  @Get("list")
  @SuccessResponse(status.OK, reply.success)
  public async listInventoryStockRequest(
    @Request() req: eRequest,
    @Query() query: string,
    @Query() grouped: boolean
  ) {
    let res;
    if(grouped) {
      res = await listInventoryStockGrouped(query);
    } else {
      // res = await listInventoryStock(query);
      //TODO: Fix if necessary or remove.
      return null;
    }
    this.setStatus(res.status);
    return res.data;
  }

  @Get("lookup")
  @SuccessResponse(status.OK, reply.success)
  public async inventoryStockLookupRequest(
    @Request() req: eRequest,
    @Query() search_value: string,
    @Query() for_sale: boolean
  ) {
    const res = await inventoryStockLookup(search_value,for_sale);
    this.setStatus(res.status);

    return res.data;
  }

  @Post("create")
  @SuccessResponse(status.CREATED, reply.success)
  public async createInventoryStockRequest(
    @Request() req: eRequest,
    @Body() body: ICreateInventoryStockRequest
  ) {
    const _inventoryStock = new InventoryStock(<IInventoryStock>{
      name: body.name,
    });

    _inventoryStock.save();

    this.setStatus(status.CREATED);
    return _inventoryStock;
  }

  @Post("delete")
  @SuccessResponse(status.OK, reply.success)
  public async deleteInventoryStock(@Query() inventoryStockId: string) {
    InventoryStock.deleteOne({ _id: inventoryStockId });
  }

  @Put("edit")
  @SuccessResponse(status.OK, reply.success)
  public async editInventoryStock() {}
}


