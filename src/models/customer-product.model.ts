import mongoose from "mongoose";
import paginate from "mongoose-paginate-v2";

const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

interface IDiscountRate {
  min_amount: number;
  disc_percent: number;
}

interface ICustomerItem {
  _id: string;
  name: string;
  code: string;
}

interface IProductItem {
  _id: string;
  product_code: string;
  name: string;
}

export interface ICustomerProduct extends mongoose.Document {
  product: IProductItem;
  customer: ICustomerItem;
  customer_sku: string;
  customer_prod_name: string;
  cost: number;
  discount_rates: IDiscountRate[];
  description: string;
  aliases: string;
}

const customerProductSchema = new mongoose.Schema({
  product_id: ObjectId,
  customer: {
    _id: ObjectId,
    name: String,
    code: String,
  },
  customer_sku: String,
  customer_prod_name: String,
  product_code: String,
  name: String,
  cost: Number,
  discount_rates: [{ min_amount: Number, disc_percent: Number }],
  description: String,
  aliases: String,
});

customerProductSchema.plugin(paginate);

export default mongoose.model<ICustomerProduct>(
  "CustomerProduct",
  customerProductSchema,
  "customer_product"
);
