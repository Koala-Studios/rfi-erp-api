import mongoose from "mongoose";
import paginate from "mongoose-paginate-v2";

export interface ILocation extends mongoose.Document {
  name: string;
  code: string;
  description: string;
  total_containers: number;
  ignore_inventory: boolean;
  created_date: string;
}

const locationSchema = new mongoose.Schema({
  name: String,
  code: String,
  description: String,
  total_containers: Number,
  ignore_inventory: Boolean,
  created_date: Date,
});

locationSchema.plugin(paginate);

export default mongoose.model<ILocation, mongoose.PaginateModel<ILocation>>(
  "Location",
  locationSchema,
  "location"
);
