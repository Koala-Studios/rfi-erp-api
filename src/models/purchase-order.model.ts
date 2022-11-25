import mongoose from "mongoose";

interface IOrderItem {
  product_code: string;
  amount: number;
  price: number;
  status: number;
  material_id: string;
  material_name:string;
  lot_number:string;
}

export interface IPurchaseOrder extends mongoose.Document {
    date_purchased: Date;
    date_arrived?: Date;
    order_code: string;
    supplier_id: string;
    supplier_name: string;
    status: number;
    order_items: [IOrderItem];
}

const purchaseOrderSchema = new mongoose.Schema({
    date_purchased: Date,
    date_arrived: Date,
    supplier_id: String,
    supplier_name: String,
    order_code: String,
    status: Number,
    order_items: 
    [{
        amount: Number,
        price: Number,
        status: Number,
        material_id: String,
        product_code: String,
        material_name: String,
        lot_number:String,
    }],
});

export default mongoose.model<IPurchaseOrder>("Purchase Order", purchaseOrderSchema, 'purchases');
