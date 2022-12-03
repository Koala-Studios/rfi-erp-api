import mongoose from "mongoose";
import paginate from "mongoose-paginate-v2";

export interface IBatching extends mongoose.Document {
  product_id: string;
  product_name?: string;
  quantity: number;
  date_created: Date;
  batch_code: string;
  status: number;
}

const batchingSchema = new mongoose.Schema({
  product_id:String,
  product_name: String,
  quantity: Number,
  date_created: Date,
  batch_code: String,
  status: Number,
});

batchingSchema.plugin(paginate);



export default mongoose.model<IBatching, mongoose.PaginateModel<IBatching>>("Batching", batchingSchema);
