import { ObjectId } from "mongodb";
import mongoose from "mongoose";
import paginate from "mongoose-paginate-v2";

interface IOrderItem {
  product_id: ObjectId;
  product_code: string;
  purchased_amount: number;
  received_amount: number;
  unit_price: number;
}

export interface IPurchaseOrder extends mongoose.Document {
    date_purchased: Date;
    date_arrived?: Date;
    order_code: string;
    supplier: {
        supplier_id: string;
        name: string;
    }
    status: number;
    order_items: [IOrderItem];
    notes:string;
}

const purchaseOrderSchema = new mongoose.Schema({

    date_purchased: Date,
    date_arrived: Date,
    supplier: {
        supplier_id: ObjectId,
        name: String,
    },
    order_code: String,
    status: Number,
    order_items: 
    [{
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
