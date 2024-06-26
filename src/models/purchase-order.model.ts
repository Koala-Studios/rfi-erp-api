import mongoose from "mongoose";
import paginate from "mongoose-paginate-v2";
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

interface IOrderItem {
  _id: String;
  product_id: String;
  product_code: string;
  sample: boolean;
  purchased_amount: number;
  received_amount: number;
  unit_price: number;
}

export const orderStatus = {
  AWAITING_SHIPPING: 1,
  AWAITING_ARRIVAL: 2,
  PARTIALLY_RECEIVED: 3,
  RECEIVED: 4,
  ABANDONED: 5,
  DRAFT: 6,
};

export interface IOrderItemProcess extends IOrderItem {
  lot_number: string;
  process_amount: number;
  container_size: number;
  expiry_date: Date;
}

export interface IPurchaseOrder extends mongoose.Document {
  date_purchased: string;
  date_arrived?: string;
  order_code: string;
  shipping_code: string;
  supplier: {
    _id: string;
    code: string;
  };
  status: number;
  order_items: [IOrderItem];
  notes: string;
}

const purchaseOrderSchema = new mongoose.Schema({
  order_code: { type: String, required: true, unique: true },
  date_purchased: String,
  date_arrived: String,
  shipping_code: String,
  supplier: {
    _id: ObjectId,
    code: String,
  },
  status: Number,
  order_items: [
    {
      _id: String,
      product_id: ObjectId,
      product_code: String,
      sample: Boolean,
      purchased_amount: Number,
      received_amount: Number,
      unit_price: Number,
    },
  ],
  notes: String,
});

purchaseOrderSchema.plugin(paginate);

export default mongoose.model<
  IPurchaseOrder,
  mongoose.PaginateModel<IPurchaseOrder>
>("Purchase Order", purchaseOrderSchema, "purchases");
