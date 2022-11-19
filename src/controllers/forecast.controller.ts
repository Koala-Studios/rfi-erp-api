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
import { calculateMaterials, IForecast } from "../logic/forecast.logic";
import { reply, status } from "./config.status";

interface calculateForecastRequest {
    products:IForecast[]
}

@Route("forecast")
@Tags("Forecast")
@Security("jwt")
export class ForecastController extends Controller {
  @Post("calculate")
  @SuccessResponse(status.OK, reply.success)
  public async calculateForecast(
    @Body() req: calculateForecastRequest
  ) {
    // console.log(req);
    const _forecast = await calculateMaterials(req.products);
    
// console.log(_forecast)

    this.setStatus(status.OK);
    return _forecast;
  }
}
