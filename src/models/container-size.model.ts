import mongoose from "mongoose";
import paginate from "mongoose-paginate-v2";

export interface IContainerSize extends mongoose.Document {
  code: string;
  name: string;
  notes: string;
  created_date: string;
}

const containerSizeSchema = new mongoose.Schema({
  code: String,
  name: String,
  size: Number,
  notes: String,
  created_date: Date,
});
containerSizeSchema.plugin(paginate);

export default mongoose.model<
  IContainerSize,
  mongoose.PaginateModel<IContainerSize>
>("ContainerSize", containerSizeSchema, "container_sizes");
