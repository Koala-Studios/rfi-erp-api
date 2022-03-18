import mongoose from "mongoose";

interface IProductContainer {
  batch_code: string;
  on_hand: number;
  in_transit: number;
  on_order: number;
  allocated: number;
}

export interface IProduct extends mongoose.Document {
  code: string;
  name: string;
  cost?: number;
  stock?: [IProductContainer];
  customers: [string];
  status: number;
  fda_status?: number;
  cpl_hazard?: string;
  ttb_status?: string;
  eu_status?: number;
  organic?: boolean;
  kosher?: boolean;
  versions?: number;
}

const productSchema = new mongoose.Schema({
  code: String,
  name: String,
  cost: Number,
  stock: [
    {
      batch_code: String,
      on_hand: Number,
      in_transit: Number,
      on_order: Number,
      allocated: Number,
    },
  ],
  customers: [String],
  status: Number,
  fda_status: Number,
  cpl_hazard: String,
  ttb_status: String,
  eu_status: Number,
  organic: Boolean,
  kosher: Boolean,
  versions: Number
});

export default mongoose.model<IProduct>("Product", productSchema);
