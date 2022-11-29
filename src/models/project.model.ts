import mongoose from "mongoose";
import paginate from "mongoose-paginate-v2";

interface IProjectItem {
  name: string;
  code: string;
  status: number;
  product_id: string | null;
  product_code: string | null;
  product_name: string | null;
  product_status: string | null;
  notes: string;
  target_cost: number | null;
}

export interface IProject extends mongoose.Document {
  start_date: Date;
  finish_date: Date;
  project_code: string;
  name: string;
  status: string;
  notes: string;
  iteration: number;
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
  project_code: String,
  name: String,
  status: String,
  notes: String,
  iteration: Number,
  assigned_user: {
    _id: String,
    email: String,
    username: String,
  },
  project_items: [
    {
      name: String,
      code: String,
      status: Number,
      product_id: String,
      product_code: String,
      product_name: String,
      product_status: String,
      notes: String,
      target_price: Number,
      assigned_user: {
        _id: String,
         email: String,
         username: String
        }
    },
  ],
});

projectSchema.plugin(paginate);

export default mongoose.model<IProject, mongoose.PaginateModel<IProject>>(
  "Project",
  projectSchema,
  "projects"
);
