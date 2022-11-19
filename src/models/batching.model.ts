import mongoose from "mongoose";

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



export default mongoose.model<IBatching>("Batching", batchingSchema);
