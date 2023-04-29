import mongoose from "mongoose";
import paginate from "mongoose-paginate-v2";

export interface ICustomer extends mongoose.Document {
  name:string;
  code: string;
  created_date: Date,
  contact_name: string;
  address_one: string;
  address_two: string;
  phone: string;
  email: string;
  lead_time: string;
  notes:string;
  products: ICustomerProducts[];
}

export interface ICustomerProducts extends mongoose.Document {
    product_id: string,
    product_code: string,
    product_name: string,
    cust_product_code: string,
    cust_product_name: string,
    cust_product_price:string;
}

const customerSchema = new mongoose.Schema({
    name:String,
    code: String,
    created_date: Date,
    contact_name: String,
    address_one: String,
    address_two: String,
    phone: String,
    email: String,
    lead_time: String,
    notes:String,
    products: [
      {    
        product_id: String,
        product_code: String,
        product_name: String,
        cust_product_code: String,
        cust_product_name: String,
        cust_product_price:String
      }
    ]
});

customerSchema.plugin(paginate);

export default mongoose.model<ICustomer, mongoose.PaginateModel<ICustomer>>("Customer", customerSchema);
