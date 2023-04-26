import mongoose from "mongoose";
import paginate from "mongoose-paginate-v2";


interface IStockSummary {
  on_hold: number;
  on_hand: number;
  on_order: number;
  in_transit: number;
  quarantined: number;
  allocated: number;
  average_price: number;
  reorder_amount: number | null;
}


export const FDA_STATUSES = {
	ARTIFICIAL: 0,
  NATURAL: 1,
  NATURAL_IDENTICAL: 2,
  NATURAL_AND_ARTIFICIAL: 3
};

export const DIETARY_STATUSES = {
  KOSHER: 0,
  VEGAN: 1,
  ORGANIC: 2,
  NON_GMO: 3,
  HALAL: 4,
  VEGETARIAN: 5
}

interface IRegulatoryContainer {
  fda_status?: number;
  cpl_hazard?: [];
  fema_number?: number;
  ttb_status?: number;
  eu_status?: number;
}

export interface IInventorySupplierItem {
  _id: string;
  name: string;
}

export interface IInventory extends mongoose.Document {
  product_code: string;
  name: string;
  average_cost: number;
  description:string;
  for_sale:boolean,
  rating?: number,
  is_raw:boolean,
  stock: IStockSummary;
  suppliers?: IInventorySupplierItem[];
  regulatory: IRegulatoryContainer; 
  dietary: {
    vegan: Boolean,
    organic: Boolean,
    kosher: Boolean,
    halal: Boolean,
  },
  aliases:string;
  cas_number?: string;
  product_type:{ name:string, code:string, _id:string }
}

const inventorySchema = new mongoose.Schema({
  product_code: {type: String, required: true, unique: true},
  name: {type: String, required: true, unique: true},
  description:String,
  aliases:String,
  average_cost: Number,
  for_sale:Boolean, //these are generated by us..
  is_raw:Boolean,//
  rating:Number,
  stock: 
    {
      on_hold: Number,
      on_hand: Number,
      on_order: Number,
      quarantined: Number,
      allocated: Number,
      average_price: Number,
      reorder_amount: Number,
      in_transit: Number
    },
  suppliers: [String],
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
  },
  cas_number: String,
  product_type:{ name:String, code: String, _id:String }
});

inventorySchema.plugin(paginate);

export default mongoose.model<IInventory, mongoose.PaginateModel<IInventory>>(
  "Inventory",
  inventorySchema,
  "inventory"
);
