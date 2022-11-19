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
import { IDevelopment } from "../models/development.model";
import Formula, { IFormula, IFormulaItem } from "../models/formula.model";
import Product from "../models/product.model";
import { reply, status } from "../config/config.status";
import { submitFormula } from "../logic/development.logic";
import { IDevelopmentSubmitInfo } from "../logic/interfaces.logic";

@Route("development")
@Tags("Development")
@Security("jwt")
export class DevelopmentController extends Controller {
  @Post("submit")
  @SuccessResponse(status.OK, reply.success)
  public async submitFormulaRequest(
    @Request() req: IDevelopmentSubmitInfo
  ) {
    
    const _res = await submitFormula(req);

    this.setStatus(_res.status);

    return _res.data;
  }
}
