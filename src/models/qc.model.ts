import mongoose from "mongoose";
import paginate from "mongoose-paginate-v2";

export interface QcRequest extends mongoose.Document {
  product_id: string;
  product_code: string;
  product_name: string;
  lot_number?: string;
  external_product: boolean;
  request_source: String;
  request_type: string;
  created_date: string;
  completed_date: string;
  test_id: string;
  notes: string;
  status: number;
}

const qcRequestSchema = new mongoose.Schema({
  product_id: String,
  product_code: String,
  product_name: String,
  lot_number: String,
  external_product: Boolean,
  request_source: String,
  request_type: String,
  created_date: Date,
  test_id: String,
  notes: String,
  status: Number,
});

qcRequestSchema.plugin(paginate);

export default mongoose.model<QcRequest, mongoose.PaginateModel<QcRequest>>(
  "Quality Control",
  qcRequestSchema
);
