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
import Formula, { IFormula } from "../models/formula.model";
import { reply, status } from "./config.status";

@Route("formula")
@Tags("Formula")
@Security("jwt")
export class FormulaController extends Controller {
  @Get("get")
  @SuccessResponse(status.OK, reply.success)
  public async getFormula(
    @Request() req: eRequest,
    @Query() product_id: string,
    @Query() version: string,
  ) {

    const _formula = await Formula.findOne({product_code:product_id, version:version})

    this.setStatus(status.OK);
    return _formula;
  }
}
