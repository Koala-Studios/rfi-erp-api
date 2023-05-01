import mongoose from "mongoose";
import paginate from "mongoose-paginate-v2";

export interface IUserRole extends mongoose.Document {
  name: string;
  permissions: string[];
}

const userRoleSchema = new mongoose.Schema({
  name: String,
  permissions: [String],
});

userRoleSchema.plugin(paginate);

export default mongoose.model<IUserRole, mongoose.PaginateModel<IUserRole>>(
  "UserRole",
  userRoleSchema,
  "user_roles"
);
