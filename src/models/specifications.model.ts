import mongoose from "mongoose";
import paginate from "mongoose-paginate-v2";

export interface ISpecs extends mongoose.Document {
  generated_date:Date,
  product_id: string,
  product_name: string,
  f_specific_gravity:number,
  t_specific_gravity:number,
  specific_gravity:number,
  f_refractive_index:number,
  t_refractive_index:number,
  refractive_index:number,
  f_flash_point:number,
  t_flash_point:number,
  flash_point:number,
  f_melting_point:number,
  t_melting_point:number,
  melting_point:number,
  appearance:string,
  kosher:boolean,
}

const specsSchema = new mongoose.Schema({
    generated_date:Date,
    product_id: String,
    product_name: String,
    f_specific_gravity:Number,
    t_specific_gravity:Number,
    specific_gravity:Number,
    f_refractive_index:Number,
    t_refractive_index:Number,
    refractive_index:Number,
    f_flash_point:Number,
    t_flash_point:Number,
    flash_point:Number,
    f_melting_point:Number,
    t_melting_point:Number,
    melting_point:Number,
    appearance:String,
    kosher:Boolean,

});

specsSchema.plugin(paginate);

export default mongoose.model<ISpecs, mongoose.PaginateModel<ISpecs>>("Specifications", specsSchema);
