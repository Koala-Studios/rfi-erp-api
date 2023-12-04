import mongoose from "mongoose";
import paginate from "mongoose-paginate-v2";
import { ICustomer } from "./customer.model";
import { ObjectId } from "mongodb";

interface IProjectItem {
  product_id: string | null;
  product_code: string | null;
  product_name: string | null;
  flavor_name: string;
  external_code: string;
  target_price: number;
  notes: string;
  target_cost: number | null;
  assigned_user: {
    _id: string;
    email: string;
    username: string;
  } | null;
  status: Number;
  regulatory_status: [Number];
  dietary_status: [Number];
}

export interface ICustomerItem {
  _id: string;
  name: string;
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
  project_code: { type: String, required: true, unique: true },
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
      _id: ObjectId,
      flavor_name: String,
      external_code: String,
      target_price: Number,
      product_id: String,
      product_code: String,
      product_name: String,
      notes: String,
      assigned_user: {
        _id: String,
        email: String,
        username: String,
      },
      status: Number,
      regulatory_status: [Number],
      dietary_status: [Number],
    },
  ],
});

projectSchema.plugin(paginate);

export default mongoose.model<IProject, mongoose.PaginateModel<IProject>>(
  "Project",
  projectSchema,
  "projects"
);
