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
import { reply, status } from "./config.status";


interface IFormulaSubmitRequest {
    yield?:number;
    formula_items: IFormulaItem[];
    product_id: string;
    approved: boolean;
}




@Route("formula")
@Tags("Formula")
@Security("jwt")
export class FormulaController extends Controller {
  @Post("submit")
  @SuccessResponse(status.OK, reply.success)
  public async postFormula(
    @Request() req: IFormulaSubmitRequest
  ) {
    //TODO: implement check for FDA status in ingredients vs in product
    let product = await Product.findById(req.product_id);
    //!If product is already approved
    if(product.status == 4) {
        this.setStatus(status.FORBIDDEN);
        this.setHeader("Product is already approved!");
        return;
    }
    product.versions+= 1;
    //*If flavorist is setting product as ready for approval
    if(req.approved) {
        product.approved_version = product.versions;
        product.status = 3;
        this.setHeader("Formula Submitted & Approved!");
    }
    const newDevelopment = new Formula(<IFormula>{
        product_code: product.code,
        version: product.versions,
        date_created: new Date(),
        formula_items: req.formula_items
    });
    newDevelopment.save();
    product.save();

    this.setStatus(status.OK);
    this.setHeader("Formula Submitted!");
    return newDevelopment;
  }
}
