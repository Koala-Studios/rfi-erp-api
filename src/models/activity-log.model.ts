import mongoose from "mongoose";
import paginate from "mongoose-paginate-v2";

export interface IActivityLog extends mongoose.Document {
  _id: string;
  user: {
    _id: string;
    username: string;
  };
  action: "delete" | "edit" | "create"; //add more later
  module: string;
  itemTitle: string;
  newItem: JSON;
  timestamp?: Date;
}

const activityLogSchema = new mongoose.Schema({
  user: {
    _id: String,
    username: String,
  },
  action: String, //deleted "product" in "Module"
  module: String,
  itemTitle: String,
  newItem: JSON,
  timestamp: Date,
});

activityLogSchema.plugin(paginate);

export default mongoose.model<
  IActivityLog,
  mongoose.PaginateModel<IActivityLog>
>("ActivityLog", activityLogSchema);
