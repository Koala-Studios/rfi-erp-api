import mongoose from "mongoose";
import paginate from "mongoose-paginate-v2";
import { ICustomer } from "./customer.model";

interface IProjectItem {
  product_id: string | null;
  product_code: string | null;
  product_name: string | null;
  product_status: number;
  flavor_name: string;
  external_code: string;
  target_price: number,
  status: number;
  notes: string;
  target_cost: number | null;
  assigned_user: {
    _id: string,
    email: string,
    username: string,
  } | null
}

export interface ICustomerItem {
  _id: string;
  name: string;
  // code: string;
  // contact_name: string;
  // address_one: string;
  // address_two: string;
  // phone: string;
  // email: string;
  // lead_time: string;
}

export interface IProject extends mongoose.Document {
  start_date: Date;
  finish_date: Date;
  project_code: string;
  name: string;
  status: number;
  notes: string;
  iteration: number;
  customer: ICustomerItem | null;
  assigned_user: {
    _id: string;
    email: string;
    username: string;
  };
  project_items: [IProjectItem];
}

const projectSchema = new mongoose.Schema({
  start_date: Date,
  due_date: Date,
  finish_date: Date,
  project_code: {type: String, required: true, unique: true},
  name: String,
  status: Number,
  notes: String,
  iteration: Number,
  customer: {
    _id: String,
    name: String,
  },
  assigned_user: {
    _id: String,
    email: String,
    username: String,
  },
  project_items: [
    {
      flavor_name: String,
      external_code: {type: String, required: true, unique: true},
      target_price: Number,
      status: Number,
      product_id: String,
      product_code: String,
      product_name: String,
      product_status: String,
      notes: String,
      assigned_user: {
        _id: String,
        email: String,
        username: String,
      },
      //TODO: Regulatory :')
    },
  ],
});

projectSchema.plugin(paginate);

export default mongoose.model<IProject, mongoose.PaginateModel<IProject>>(
  "Project",
  projectSchema,
  "projects"
);
