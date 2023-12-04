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

export interface IBatching extends mongoose.Document {
  product_id: string;
  product_code: string;
  name?: string;
  sales_id?: string;
  quantity: number;
  date_created: Date;
  date_needed: Date;
  ingredients: IBatchingIngredient[];
  batch_code: string;
  status: number;
  notes: string;
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
  used_amount: number;
  has_enough?: boolean;
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
  used_amount: Number,
  has_enough: Boolean,
});

const batchingSchema = new mongoose.Schema({
  product_id: String,
  product_code: String,
  name: String,
  sales_id: String,
  quantity: Number,
  date_created: Date,
  date_needed: Date,
  ingredients: { type: [ingredientSchema] },
  batch_code: String,
  status: Number,
  notes: String,
});

batchingSchema.plugin(paginate);

export default mongoose.model<IBatching, mongoose.PaginateModel<IBatching>>(
  "Batching",
  batchingSchema
);
