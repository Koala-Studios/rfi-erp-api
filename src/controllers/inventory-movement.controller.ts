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
import InventoryMovement, {
  IInventoryMovement,
} from "../models/inventory-movements.model";
import { reply, status } from "../config/config.status";
import { inventoryLookup, listInventory } from "../logic/inventory.logic";
import ProductType, { IProductType } from "../models/product-type.model";
import { generateProductCode } from "../logic/utils";
import { listInventoryMovement } from "../logic/inventory-movements.logic";

@Route("inventory-movement")
@Tags("InventoryMovement")
@Security("jwt")
export class InventoryMovementController extends Controller {
  @Get("list")
  @SuccessResponse(status.OK, reply.success)
  public async listInventoryMovementRequest(
    @Request() req: eRequest,
    @Query() query: string,
    @Query() product_id?: string
  ) {
    const res = await listInventoryMovement(query, product_id);
    this.setStatus(res.status);

    return res.data;
  }
}
