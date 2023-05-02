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
import Formula, { IFormula, IFormulaItem } from "../models/formula.model";
import Inventory from "../models/inventory.model";
import { reply, status } from "../config/config.status";
import { getFormula } from "../logic/formula.logic";
import { submitFormula } from "../logic/formula.logic";
import { IFormulaSubmitInfo } from "../logic/interfaces.logic";
var ObjectId = require("mongodb").ObjectId;
@Route("formula")
@Tags("Formula")
@Security("jwt")
export class FormulaController extends Controller {
  @Get("get")
  @SuccessResponse(status.OK, reply.success)
  public async getFormulaRequest(
    @Request() req: eRequest,
    @Query() product_id: string,
    @Query() version: string
  ) {
    const _res = await getFormula(product_id, version);

    this.setStatus(_res.status);

    return _res.data;
  }

  @Post("submit")
  @SuccessResponse(status.OK, reply.success)
  public async submitFormulaRequest(
    @Request() req: eRequest,
    @Query() approved: boolean,
    @Body() formula: IFormula,
    @Query() description: string
  ) {
    const _res = await submitFormula(formula, approved, description);

    this.setStatus(_res.status);

    return _res.data;
  }
}
