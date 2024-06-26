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
import InventoryStock, {
  IInventoryStock,
} from "../models/inventory-stock.model";
import { reply, status } from "../config/config.status";
import {
  inventoryStockLookup,
  listInventoryContainers,
  listInventoryStockGrouped,
  listLocationContainers,
  moveBulkContainers,
} from "../logic/inventory-stock.logic";

interface ICreateInventoryStockRequest {
  name: string;
}

interface ILocation {
  _id: string;
  code: string;
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
    if (grouped) {
      res = await listInventoryStockGrouped(query);
    } else {
      // res = await listInventoryStock(query);
      //TODO: Fix if necessary or remove.
      return null;
    }
    this.setStatus(res.status);
    return res.data;
  }

  @Get("list-containers")
  @SuccessResponse(status.OK, reply.success)
  public async listInventoryContainersRequest(
    @Request() req: eRequest,
    @Query() query: string,
    @Query() product_id?: string
  ) {
    const res = await listInventoryContainers(query, product_id);
    this.setStatus(res.status);

    return res.data;
  }

  @Get("list-location-containers")
  @SuccessResponse(status.OK, reply.success)
  public async listLocationContainersRequest(
    @Request() req: eRequest,
    @Query() location_id?: string
  ) {
    const res = await listLocationContainers(location_id);
    this.setStatus(res.status);

    return res.data;
  }

  @Get("lookup")
  @SuccessResponse(status.OK, reply.success)
  public async inventoryStockLookupRequest(
    @Request() req: eRequest,
    @Query() search_value: string,
    @Query() product_id?: string
  ) {
    const res = await inventoryStockLookup(search_value, product_id);
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

  @Post("move-bulk")
  @SuccessResponse(status.OK, reply.success)
  public async inventoryBulkMoveRequest(
    @Request() req: eRequest,
    @Query() container_ids: string[],
    @Body() location: ILocation
  ) {
    const res = await moveBulkContainers(container_ids, location);
    this.setStatus(res.status);
    return res.data;
  }
}
