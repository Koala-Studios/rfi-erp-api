import mongoose from "mongoose";
import paginate from "mongoose-paginate-v2";

export interface IApplication extends mongoose.Document {
  code: string;
  name: string;
  notes: string;
  created_date: string;
}

const applicationSchema = new mongoose.Schema({
  code: String,
  name: String,
  notes: String,
  created_date: Date,
});
applicationSchema.plugin(paginate);

export default mongoose.model<
  IApplication,
  mongoose.PaginateModel<IApplication>
>("Application", applicationSchema, "application");
