import mongoose, { ObjectId } from "mongoose";
import paginate from "mongoose-paginate-v2";

export const batchingStatus = {
  DRAFT: 1,
  SCHEDULED: 2,
  IN_PROGRESS: 3,
  FINISHED: 4, //TODO: update db status of 2 to 3
  ABANDONED: 5,
  CANCELLED: 6,
};

export const batchingSource = {
  BATCHING: "Batching",
  SALES_ORDER: "SalesOrder",
};

export interface IBatching extends mongoose.Document {
  product_id: string;
  product_code: string;
  name?: string;
  source_id?: string;
  source_type?: number;
  customer?: { _id: string; code: string };
  quantity: number;
  date_created: string;
  date_needed: string;
  ingredients: IBatchingIngredient[];
  batch_code: string;
  status: number;
  notes: string;
  has_enough?: boolean;
  container_size: number;
}

export interface IBatchingContainer {
  _id: string;
  lot_number: string;
  confirm_lot_number: string;
  used_amount: number;
}

export interface IBatchingIngredient {
  _id: string;
  product_id: string;
  product_code: string;
  product_name: string;
  required_amount: number;
  used_containers: IBatchingContainer[];
  total_used_amount: number;
  has_enough?: boolean;
  avoid_recur?: boolean;
}

const ingredientSchema = new mongoose.Schema({
  _id: String,
  product_id: String,
  product_code: String,
  product_name: String,
  required_amount: Number,
  used_containers: [
    {
      container_id: String,
      lot_number: String,
      confirm_lot_number: String,
      used_amount: Number,
    },
  ],
  total_used_amount: Number,
  has_enough: Boolean,
  avoid_recur: Boolean,
});

const batchingSchema = new mongoose.Schema({
  product_id: String,
  product_code: String,
  name: String,
  source_id: String,
  source_type: String,
  customer: { _id: String, code: String },
  quantity: Number,
  date_created: Date,
  date_needed: Date,
  ingredients: { type: [ingredientSchema] },
  batch_code: String,
  status: Number,
  notes: String,
  has_enough: Boolean,
});

batchingSchema.plugin(paginate);

export default mongoose.model<IBatching, mongoose.PaginateModel<IBatching>>(
  "Batching",
  batchingSchema
);
