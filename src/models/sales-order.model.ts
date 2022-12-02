import mongoose from "mongoose";
import paginate from "mongoose-paginate-v2";

interface IOrderItem {
  product_code: string;
  customer_p_code:string;
  amount: number;
  price: number;
  status: number;
  product_id: string;
  product_name:string;
  lot_number:string;
}

export interface ISalesOrder extends mongoose.Document {
    date_of_purchase: Date;
    date_sent?: Date;
    order_code: string;
    customer_id: string;
    customer_name: string;
    notes: string;
    status: number;
    order_items: [IOrderItem];
}

const salesOrderSchema = new mongoose.Schema({
    date_purchased: Date,
    date_arrived: Date,
    customer_id: String,
    customer_name: String,
    order_code: String,
    status: Number,
    order_items: 
    [{
        product_code: String,
        customer_p_code:String,
        amount: Number,
        price: Number,
        status: Number,
        product_id: String,
        product_name: String,
        lot_number:String,
    }],
});

salesOrderSchema.plugin(paginate);

export default mongoose.model<ISalesOrder, mongoose.PaginateModel<ISalesOrder>>("Sales Order", salesOrderSchema, 'sales');
