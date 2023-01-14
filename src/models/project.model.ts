import mongoose from "mongoose";
import paginate from "mongoose-paginate-v2";
import { ICustomer } from "./customer.model";

interface IProjectItem {
  flavor_name: string;
  code: string;
  status: number;
  product_id: string | null;
  product_code: string | null;
  product_name: string | null;
  product_status: number;
  notes: string;
  target_cost: number | null;
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
  start_date: string;
  finish_date: string;
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
  start_date: String,
  due_date: String,
  finish_date: String,
  project_code: String,
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
      code: String,
      status: Number,
      product_id: String,
      product_code: String,
      product_name: String,
      product_status: Number,
      notes: String,
      target_price: Number,
      assigned_user: {
        _id: String,
        email: String,
        username: String,
      },
    },
  ],
});

projectSchema.plugin(paginate);

export default mongoose.model<IProject, mongoose.PaginateModel<IProject>>(
  "Project",
  projectSchema,
  "projects"
);
