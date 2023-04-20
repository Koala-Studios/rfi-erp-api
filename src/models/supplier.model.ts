import mongoose from "mongoose";
import paginate from "mongoose-paginate-v2";

export interface ISupplier extends mongoose.Document {
  name:string;
  code: string;
  created_date: Date;
  contact_name: string;
  address_one: string;
  address_two: string;
  phone: string;
  email: string;
  lead_time: string;
  notets: string;
  trust_factor: number;
  products: ISupplierProducts[]
}


export interface ISupplierProducts extends mongoose.Document {
  product_id: string,
  supp_product_code?:string,
  product_code: string,
  product_name: string,
}


const supplierSchema = new mongoose.Schema({
    name:String,
    code: String,
    created_date: Date,
    contact_name: String,
    address_one: String,
    address_two: String,
    phone: String,
    email: String,
    lead_time: String,
    notets: String,
    trust_factor: Number,
    products: [
      {    
        product_id: String,
        product_code: String,
        product_name: String,
        price: Number
      }
    ]
}, { timestamps: true });

supplierSchema.plugin(paginate);

export default mongoose.model<ISupplier, mongoose.PaginateModel<ISupplier>>("Supplier", supplierSchema);
