import mongoose, { ObjectId } from "mongoose";
import paginate from "mongoose-paginate-v2";

export const batchingStatus = {
  SCHEDULED: 1,
  IN_PROGRESS: 2,
  FINISHED: 3, //TODO: update db status of 2 to 3
  ABANDONED: 4,
  CANCELLED: 5,
  DRAFT: 6,
};

export interface IBatching extends mongoose.Document {
  product_id: string;
  product_code: string;
  name?: string;
  quantity: number;
  date_created: Date;
  date_needed: Date;
  ingredients: IBatchingIngredient[];
  batch_code: string;
  status: number;
  notes: string;
}

export interface IBatchingContainer {
  container_id: string;
  lot_number: string;
  amount_used: string;
}

export interface IBatchingIngredient {
  _id: string;
  product_id: string;
  product_code: string;
  product_name: string;
  required_amount: number;
  used_containers: IBatchingContainer[];
  used_amount: number;
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
      used_amount: String,
    },
  ],
  used_amount: Number,
});

const batchingSchema = new mongoose.Schema({
  product_id: String,
  product_code: String,
  name: String,
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
