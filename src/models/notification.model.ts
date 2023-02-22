import mongoose, { ObjectId } from "mongoose";
import paginate from "mongoose-paginate-v2";

export interface INotification {
  _id?: string;
  n_type: number; //notification type;
  text?: string;
  ref?: string; //any reference id needed for notification
  sender?: string;
  save?: boolean;
}

export interface INotificationCluster extends mongoose.Document {
  receiverId: string; //owner of notifications,
  notifications: INotification[];
}

export const notificationType = {
  text: 0,
};

const notificationSchema = new mongoose.Schema({
  receiverId: String,
  notifications: [
    {
      text: String,
      ref: String,
      sender: String,
      n_type: Number,
    },
  ],
});

notificationSchema.plugin(paginate);

export default mongoose.model<
  INotificationCluster,
  mongoose.PaginateModel<INotificationCluster>
>("Notifications", notificationSchema);
