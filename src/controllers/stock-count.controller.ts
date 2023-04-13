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
import StockCount, { IStockCount } from "../models/stock-count.model";
import { reply, status } from "../config/config.status";
import { createStockCount, listStockCount } from "../logic/stock-count.logic";

@Route("stock-counts")
@Tags("StockCount")
@Security("jwt")
export class StockCountController extends Controller {
    @Get("list")
    @SuccessResponse(status.OK, reply.success)
    public async listStockCountRequest(
        @Request() req: eRequest,
        @Query() query:string
    ) {

        console.log(JSON.parse(query));

        const res = await listStockCount(query);
        this.setStatus(res.status);
        return res.data;
    }

    @Post("create")
    @SuccessResponse(status.CREATED, reply.success)
    public async createStockCountRequest(
        @Request() req: eRequest,
        @Body() body: IStockCount
    ) {
        const _res = await createStockCount(body);

        this.setStatus(_res.status);
        return _res.data;
    }

    @Post("delete")
    @SuccessResponse(status.OK, reply.success)
    public async deleteStockCount(@Query() stockCountId: string) {
        //TODO:MOVE TO LOGIC
        //StockCount.deleteOne({ _id: stockCountId });
    }

    @Put("edit")
    @SuccessResponse(status.OK, reply.success)
    public async editStockCount() { }
}
