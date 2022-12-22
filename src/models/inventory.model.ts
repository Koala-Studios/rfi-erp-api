import mongoose from "mongoose";
import paginate from "mongoose-paginate-v2";

interface IInventoryContainer {
  batch_code: string;
  cont_amount: Number;
  supplier_id: string;
  exp_date: Date;
  received_date: Date;
  on_hold: number;
  on_hand: number;
  on_order: number;
  quarantined: number;
  allocated: number;
  price: number;
}

interface IRegulatoryContainer {
  fda_status?: number;
  cpl_hazard?: string;
  fema_number?: number;
  ttb_status?: string;
  eu_status?: number;
  organic?: boolean;
  kosher?: boolean;
}

export interface IInventory extends mongoose.Document {
  product_code: string;
  name: string;
  average_cost: number;
  for_sale:boolean,
  is_raw:boolean,
  stock?: [IInventoryContainer];
  reorder_amount?: number;
  suppliers?: [string];
  regulatory: IRegulatoryContainer;
  cas_number?: string;
}

const inventorySchema = new mongoose.Schema({
  product_code: String,
  name: String,
  average_cost: Number,
  for_sale:Boolean,
  is_raw:Boolean,
  stock: [
    {
      supplier_id: String,
      batch_code: String,
      cont_amount: Number,
      exp_date: Date,
      received_date: Date,
      on_hand: Number,
      in_transit: Number,
      on_order: Number,
      on_hold: Number,
      quarantined: Number,
      allocated: Number,
      price: Number,
    },
  ],
  reorder_amount: Number,
  suppliers: [String],
  regulatory: {
    fda_status: Number,
    cpl_hazard: String,
    fema_number: Number,
    ttb_status: String,
    eu_status: Number,
    organic: Boolean,
    kosher: Boolean,
  },
  cas_number: String,
});

inventorySchema.plugin(paginate);

export default mongoose.model<IInventory, mongoose.PaginateModel<IInventory>>(
  "Inventory",
  inventorySchema,
  "inventory"
);
