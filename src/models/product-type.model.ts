import mongoose from "mongoose";
import paginate from "mongoose-paginate-v2";

export interface IProductType extends mongoose.Document {
  name:string;
  code: string;
  is_raw:boolean;
  for_sale:boolean
}

const productTypeSchema = new mongoose.Schema({
    name:String,
    code: String,
    is_raw:Boolean,
    for_sale:Boolean
});

productTypeSchema.plugin(paginate);

export default mongoose.model<IProductType, mongoose.PaginateModel<IProductType>>("ProductType", productTypeSchema,"product_types");
