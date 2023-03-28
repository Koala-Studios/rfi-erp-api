import mongoose from "mongoose";
import paginate from "mongoose-paginate-v2";

export interface IProductType extends mongoose.Document {
  name:string;
  total:number;
  code: string;
  is_raw:boolean;
  for_sale:boolean;
  avoid_recur:boolean;
}

const productTypeSchema = new mongoose.Schema({
    name:String,
    total:Number,
    code: String,
    is_raw:Boolean,
    for_sale:Boolean,
    avoid_recur:Boolean,
});

productTypeSchema.plugin(paginate);

export default mongoose.model<IProductType, mongoose.PaginateModel<IProductType>>("ProductType", productTypeSchema,"product_types");
