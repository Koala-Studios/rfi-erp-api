import mongoose from "mongoose";
import paginate from "mongoose-paginate-v2";

interface IStockSummary {
  on_hold: number;
  on_hand: number;
  on_order: number;
  quarantined: number;
  allocated: number;
  average_price: number;
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
  stock?: IStockSummary;
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
  stock: 
    {
      on_hold: Number,
      on_hand: Number,
      on_order: Number,
      quarantined: Number,
      allocated: Number,
      average_price: Number,
    },
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
