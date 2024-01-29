import mongoose from "mongoose";
import paginate from "mongoose-paginate-v2";

export interface IQualityControl extends mongoose.Document {
  product_id: string;
  product_code: string;
  product_name: string;
  lot_number?: string;
  external_product: boolean;
  request_source: String;
  request_type: string;
  created_date: string;
  completed_date: string | null;
  test_id: string | null;
  notes: string;
  status: number;
}

export const orderStatus = {
  PENDING: 0,
  FAILED: 1,
  APPROVED: 2,
};

const qualityControlSchema = new mongoose.Schema({
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

qualityControlSchema.plugin(paginate);

export default mongoose.model<
  IQualityControl,
  mongoose.PaginateModel<IQualityControl>
>("Quality Control", qualityControlSchema);
