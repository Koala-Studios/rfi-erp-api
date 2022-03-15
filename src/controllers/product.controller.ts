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
import Product, {IProduct} from "../models/product.model";
import { reply, status } from "./config.status";

interface ICreateProductRequest{
    name:string;
}


@Route("products")
@Tags("Products")
@Security("jwt")
export class ProductController extends Controller {
    @Get("list")
  @SuccessResponse(status.OK, reply.success)
  public async listProduct(
    @Request() req: eRequest,
    @Query() page: string,
    @Query() count: string
  ) {
    const _page = parseInt(<string>page);
    const _count = parseInt(<string>count);

    const _products = await Product.find()
      .sort({date_created:-1})
      .skip(_page * _count)
      .limit(_count);

    this.setStatus(status.OK);
    return _products;
  }

    @Post("create")
    @SuccessResponse(status.CREATED, reply.success)
    public async addProduct(@Request() req: eRequest,@Body() body: ICreateProductRequest) {
        
        const _Product = new Product(<IProduct>{
            name:body.name
        });

        _Product.save();

        this.setStatus(status.CREATED);
        return Product;
    }

    @Post("delete")
    @SuccessResponse(status.OK, reply.success)
    public async deleteProduct( @Query() productId: string){

        Product.deleteOne({_id:productId});

    }

    @Put("edit")
    @SuccessResponse(status.OK, reply.success)
    public async editProduct(){

    }
   
  
}
