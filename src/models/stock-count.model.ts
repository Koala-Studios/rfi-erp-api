import mongoose, { ObjectId } from "mongoose";
import paginate from "mongoose-paginate-v2";
import { IInventoryStock } from "./inventory-stock.model";
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const StockCountStatus = [
  ["DRAFT", "warning"],
  ["SUBMITTED", "warning"],
  ["APPROVED", "success"],
  ["ABANDONED", "error"],
];

export const stockCountStatus = {
  DRAFT: 1,
  SUBMITTED: 2,
  APPROVED: 3,
  ABANDONED: 4,
};
export interface ICountItem {
  _id: string;
  product_id: string;
  product_code: string;
  name: string;
  lot_number: string;
  expiry_date: string;
  container_id: string;
  container_size: number;
  container_amount: number;
  current_amount: number;
  proposed_amount: number;
}

export interface IStockCount extends mongoose.Document {
  count_code: string;
  created_date: string;
  approved_date: string;
  count_items: ICountItem[];
  status: number;
  notes: string;
}

const stockCountSchema = new mongoose.Schema({
  count_code: { type: String, required: true, unique: true },
  created_date: Date,
  approved_date: Date,
  count_items: [
    {
      _id: ObjectId,
      product_id: ObjectId,
      product_code: String,
      name: String,
      lot_number: String,
      expiry_date: Date,
      container_id: ObjectId,
      container_size: Number,
      container_amount: Number,
      current_amount: Number,
      proposed_amount: Number,
    },
  ],
  status: Number,
  notes: String,
});

stockCountSchema.plugin(paginate);

export default mongoose.model<IStockCount, mongoose.PaginateModel<IStockCount>>(
  "Stock Count",
  stockCountSchema,
  "stock_counts"
);
