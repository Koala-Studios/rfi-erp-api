import mongoose from "mongoose";
import paginate from "mongoose-paginate-v2";

export const orderStatus = {
  AWAITING_PRODUCTION: 1,
  AWAITING_SHIPPING: 2,
  PARTIALLY_FINISHED: 3,
  FINISHED: 4,
  ABANDONED: 5,
  DRAFT: 6,
};

interface ISalesOrderItem {
  product_code: string;
  customer_p_code: string;
  sold_amount: number;
  unit_price: number;
  status: number;
  product_id: string;
  product_name: string;
  lot_number: string;
}
interface ISalesCustomer {
  _id: string;
  code: string;
  name: string;
}

export interface ISalesOrder extends mongoose.Document {
  date_of_purchase: Date;
  date_sent?: Date;
  order_code: string;
  shipping_code: string;
  customer: ISalesCustomer;
  notes: string;
  status: number;
  order_items: [ISalesOrderItem];
}

const salesOrderSchema = new mongoose.Schema({
  date_purchased: Date,
  date_arrived: Date,
  customer: { _id: String, code: String, name: String },
  shipping_code: String,
  order_code: { type: String, required: true, unique: true },
  status: Number,
  notes: String,
  order_items: [
    {
      product_code: String,
      customer_p_code: String,
      sold_amount: Number,
      unit_price: Number,
      status: Number,
      product_id: String,
      product_name: String,
      lot_number: String,
    },
  ],
});

salesOrderSchema.plugin(paginate);

export default mongoose.model<ISalesOrder, mongoose.PaginateModel<ISalesOrder>>(
  "Sales Order",
  salesOrderSchema,
  "sales"
);
