import mongoose from "mongoose";
import paginate from "mongoose-paginate-v2";
export interface IUser extends mongoose.Document {
  email: string;
  username: string;
  photo: string;
  roles: IUserRole[]; //ids of roles
  identities: string[];
}
export interface IUserRole {
  _id: string;
  name: string;
}

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    minLength: 3,
  },
  roles: {
    _id: String,
    name: String,
  },
  identities: [String],
});

userSchema.pre<IUser>("save", async function (next) {
  const user = this;
  if (!user.isModified("username")) return next();

  user.username = user.username.toLowerCase();

  next();
});

userSchema.plugin(paginate);

export default mongoose.model<IUser, mongoose.PaginateModel<IUser>>(
  "User",
  userSchema
);
