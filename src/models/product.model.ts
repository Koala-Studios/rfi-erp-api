import mongoose from "mongoose";
import paginate from "mongoose-paginate-v2";

interface IProductContainer {
  batch_code: string;
  cont_amount: Number;
  supplier_id: string;
  exp_date: Date;
  received_date: Date;
  on_hold: number;
  on_hand: number;
  on_transit: number;
  quarantined: number;
  allocated: number;
  price: number;
}

interface IRegulatoryContainer {
  fda_status?:number;
  cpl_hazard?:string;
  fema_number?:number;
  ttb_status?:string;
  eu_status?:number;
  organic?:boolean;
  kosher?:boolean;
}


export interface IProduct extends mongoose.Document {
  name:string;
  description:string;
  rating:number;
  product_code: string;
  is_raw_mat?: boolean,
  cost?: number;
  stock?: IProductContainer;
  customers: [string];
  regulatory:IRegulatoryContainer;
  versions?: number;
  status: number;
  approved_version?: number;
  rec_dose_rate?:number;
}

const productSchema = new mongoose.Schema({
  name:String,
  product_code: String,
  cost: Number,
  is_raw_mat:Boolean,
  versions: Number,
  approved_version: Number,
  rec_dose_rate: Number,
  stock: [
    {
      batch_date: Date,
      batch_code: String,
      on_hand: Number,
      on_order: Number,
      allocated: Number,
      on_hold: Number,
      quarantined: Number,
      ready_for_transit: Number,
    },
  ],
  customers: [String],
  status: Number,
  regulatory: {
    fda_status: Number,
    cpl_hazard: String,
    fema_number: Number,
    ttb_status: String,
    eu_status:Number,
    organic: Boolean,
    kosher: Boolean, 
  },
});

productSchema.plugin(paginate);

export default mongoose.model<IProduct, mongoose.PaginateModel<IProduct>>("Product", productSchema,'inventory');
