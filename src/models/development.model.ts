
import mongoose from "mongoose";

interface IDevelopmentItem {
  product_id: string;
  inventory_id :string;
  amount: number;
  notes?:string;
  status: number;
}

export interface IDevelopment extends mongoose.Document {
    date_proposed: Date;
    development_item: [IDevelopmentItem];
    status: number;
}

const developmentSchema = new mongoose.Schema({
    date_proposed: Date,
    development_item: {
        product_id: String,
        inventory_id : String,
        amount: Number,
        notes: String,
        status: Number
    },
    status: Number,
});

export default mongoose.model<IDevelopment>("Development", developmentSchema);