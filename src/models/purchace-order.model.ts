import mongoose from "mongoose";

interface IOrderItem {
  product_id: string;
  amount: number;
  supplier: string;
  price: number;
  status: number;
}

export interface IPurchaseOrder extends mongoose.Document {
    date_purchased: Date;
    date_arrived?: Date;
    order_code: string;
    status: number;
    order_items: [IOrderItem];
}

const purchaseOrderSchema = new mongoose.Schema({
    date_purchased: Date,
    date_arrived: Date,
    order_code: String,
    status: Number,
    order_items: 
    {
        product_id: String,
        amount: Number,
        supplier: String,
        price: Number,
        status: Number,
        date_purchased: Date,
    },
});

export default mongoose.model<IPurchaseOrder>("Purchase Order", purchaseOrderSchema, 'purchases');
