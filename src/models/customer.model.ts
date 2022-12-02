import mongoose from "mongoose";
import paginate from "mongoose-paginate-v2";

export interface ICustomer extends mongoose.Document {
  name:string;
  code: string;
  contact_name: string;
  address_one: string;
  address_two: string;
  phone: string;
  email: string;
  lead_time: string;
}

export interface ICustomerProducts extends mongoose.Document {
    product_id: string,
    product_name: string,
    customer_p_code: string,
    customer_p_name: string,
    customer_p_price:string;
}

const customerSchema = new mongoose.Schema({
    name:String,
    code: String,
    contact_name: String,
    address_one: String,
    address_two: String,
    phone: String,
    email: String,
    lead_time: String,
});

customerSchema.plugin(paginate);

export default mongoose.model<ICustomer, mongoose.PaginateModel<ICustomer>>("Customer", customerSchema);
