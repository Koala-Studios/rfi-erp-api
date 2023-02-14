import { ObjectId } from "mongodb";
import mongoose from "mongoose";
import paginate from "mongoose-paginate-v2";

interface IOrderItem {
  _id:ObjectId,
  product_id: ObjectId;
  product_code: string;
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
    lot_number:string,
    process_amount:number,
    container_size:number,
    expiry_date:Date,
  }

export interface IPurchaseOrder extends mongoose.Document {
    date_purchased: string;
    date_arrived?: string;
    order_code: string;
    shipping_code:string;
    supplier: {
        supplier_id: string;
        name: string;
    }
    status: number;
    order_items: [IOrderItem];
    notes:string;
}

const purchaseOrderSchema = new mongoose.Schema({

    date_purchased: String,
    date_arrived: String,
    shipping_code:String,
    supplier: {
        supplier_id: ObjectId,
        name: String,
    },
    order_code: String,
    status: Number,
    order_items: 
    [{
        _id:ObjectId,
        product_id:ObjectId,
        product_code: String,
        purchased_amount: Number,
        received_amount: Number,
        unit_price: Number
    }],
    notes:String
});

purchaseOrderSchema.plugin(paginate);

export default mongoose.model<IPurchaseOrder, mongoose.PaginateModel<IPurchaseOrder>>("Purchase Order", purchaseOrderSchema, 'purchases');
