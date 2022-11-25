import mongoose from "mongoose";

interface IOrderItem {
  product_id: string;
  amount: number;
  price: number;
  status: number;
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
        product_id: String,
        amount: Number,
        received: Number,
        supplier: String,
        price: Number,
        status: Number,
        date_purchased: Date,
    }],
});

export default mongoose.model<IPurchaseOrder>("Purchase Order", purchaseOrderSchema, 'purchases');
