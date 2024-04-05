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

export const orderItemStatus = {
  PENDING: 1,
  SCHEDULED: 2,
  IN_PROGRESS: 3,
  WAITING_QC: 4,
  WAITING_SHIPPING: 5,
  SHIPPED: 6,
};

interface ISalesOrderItem {
  _id: string;
  product_code: string;
  product: { _id: string; product_code: string; name: string };
  customer_sku: string;
  c_prod_name: string;
  sold_amount: number;
  unit_price: number;
  status: number;
  product_id: string;
  batch_id: string;
  lot_number: string;
}

export interface ISalesOrderItemProcess extends ISalesOrderItem {
  date_needed: string;
  process_amount: number;
  container_size: number;
  // expiry_date: Date;
}

interface ISalesCustomer {
  _id: string;
  code: string;
  name: string;
}

export interface ISalesOrder extends mongoose.Document {
  date_sold: string;
  date_sent?: Date;
  order_code: string;
  shipping_code: string;
  customer: ISalesCustomer;
  notes: string;
  status: number;
  order_items: ISalesOrderItem[];
}

const salesOrderSchema = new mongoose.Schema({
  date_sold: Date,
  date_arrived: Date,
  customer: { _id: String, code: String, name: String },
  shipping_code: String,
  order_code: { type: String, required: true, unique: true },
  status: Number,
  notes: String,
  order_items: [
    {
      _id: String,
      product: { _id: String, product_code: String, name: String },
      customer_sku: String,
      c_prod_name: String,
      sold_amount: Number,
      unit_price: Number,
      status: Number,
      product_id: String,
      batch_id: String,
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
