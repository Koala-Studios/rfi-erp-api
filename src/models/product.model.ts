import mongoose from "mongoose";
import paginate from "mongoose-paginate-v2";
import { ICustomer } from "./customer.model";

interface IStockSummary {
  on_hold: number;
  on_hand: number;
  on_order: number;
  quarantined: number;
  allocated: number;
  average_price: number;
  reorder_amount: number | null;
}

export const FDA_STATUSES = {
  ARTIFICIAL: 0,
  NATURAL: 1,
  NATURAL_IDENTICAL: 2,
  NATURAL_AND_ARTIFICIAL: 3,
};

interface IRegulatoryContainer {
  cpl_hazard?: [];
  fda_status?: number;
  fema_number?: number;
  eu_status?: number;
  ttb_status?: number;
}
export interface IProduct extends mongoose.Document {
  product_code: string;
  name: string;
  average_cost?: number;
  description: string;
  rating: number | null;
  date_created: string;
  is_raw?: boolean;
  for_sale: boolean;
  avoid_recur: boolean;
  versions?: number;
  approved_version?: number | undefined;
  status: number;
  rec_dose_rate: number;
  stock?: IStockSummary;
  regulatory: IRegulatoryContainer;
  aliases: string;
  product_type: { name: string; code: string; _id: string };
}

const productSchema = new mongoose.Schema({
  product_code: { type: String, required: true, unique: true },
  name: { type: String, required: true, unique: true },
  aliases: String,
  cost: Number,
  rating: Number,
  date_created: Date,
  for_sale: Boolean,
  is_raw: Boolean,
  avoid_recur: Boolean,
  versions: Number,
  approved_version: Number,
  rec_dose_rate: Number,
  stock: {
    on_hand: Number,
    on_order: Number,
    on_hold: Number,
    quarantined: Number,
    allocated: Number,
    average_price: Number,
    reorder_amount: Number,
  },
  status: Number,
  regulatory: {
    fda_status: Number,
    cpl_hazard: [],
    fema_number: Number,
    ttb_status: Number,
    eu_status: Number,
  },
  dietary: {
    vegan: Boolean,
    organic: Boolean,
    kosher: Boolean,
    halal: Boolean,
    non_gmo: Boolean,
  },
  product_type: { name: String, code: String, _id: String },
});

productSchema.plugin(paginate);

export default mongoose.model<IProduct, mongoose.PaginateModel<IProduct>>(
  "Product",
  productSchema,
  "inventory"
);
