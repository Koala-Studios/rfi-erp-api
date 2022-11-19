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
import Inventory from "../models/inventory.model";
import { reply, status } from "./config.status";
var ObjectId = require('mongodb').ObjectId; 
@Route("formula")
@Tags("Formula")
@Security("jwt")
export class FormulaController extends Controller {
  @Get("get")
  @SuccessResponse(status.OK, reply.success)
  public async getFormula(
    @Request() req: eRequest,
    @Query() product_id: string,
    // @Query() version: string,
  ) {
    const test_product_id = new ObjectId( product_id)
    const _formula = await Formula.findOne({product_id :test_product_id,  $max: "version"})
    if(!_formula) {
      this.setStatus(status.OK);
      return null;
    }
    for (let index = 0; index < _formula.formula_items.length; index++) {
      const material_id =  _formula.formula_items[index].material_id;
      const material = await Inventory.findOne({_id: material_id})
      // console.log(material_id, material.name)
      _formula.formula_items[index].material_name = material.name;
    }
    this.setStatus(status.OK);
    return _formula;
  }
}
