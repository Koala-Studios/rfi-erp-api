import mongoose from "mongoose";
import paginate from "mongoose-paginate-v2";

const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

interface IDiscountRate {
  min_amount: number;
  percent: number;
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
  c_prod_name: string;
  rec_dose: number;
  price: number;
  discount_rates: IDiscountRate[];
  description: string;
}

const customerProductSchema = new mongoose.Schema({
  product: { _id: String, product_code: String, name: String },
  customer: {
    _id: ObjectId,
    name: String,
    code: String,
  },
  rec_dose: Number,
  customer_sku: { type: String, unique: true },
  c_prod_name: String,
  price: Number,
  discount_rates: [{ min_amount: Number, percent: Number }],
  description: String,
});

customerProductSchema.plugin(paginate);

export default mongoose.model<
  ICustomerProduct,
  mongoose.PaginateModel<ICustomerProduct>
>("CustomerProduct", customerProductSchema, "customer_products");
