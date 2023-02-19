import { sendNotification } from "../sockets/notification.socket";
import Notification, {
  INotification,
  INotificationCluster,
  notificationType,
} from "../models/notification.model";
import mongoose from "mongoose";
import { ObjectId } from "mongodb";

export const notify = async (
  text: string,
  save: boolean, //save notification or not
  sender?: string,
  receiverId?: string
): Promise<INotification> => {
  let n: INotification = {
    text,
    sender,
    n_type: notificationType.text,
    save,
  };

  createNotification(n, receiverId);
  return n;
};

const createNotification = async (
  n: INotification,
  receiverId?: string
): Promise<INotification> => {
  n._id = new mongoose.Types.ObjectId().toHexString();

  if (receiverId && n.save) {
    let newNotification = n;
    delete newNotification.save;

    let nc = await Notification.findOne({ receiverId: receiverId });

    if (nc) {
      nc.notifications.push(newNotification);
      nc.save();
    } else {
      nc = new Notification(<INotificationCluster>{
        receiverId: receiverId,
        notifications: [newNotification],
      });
      console.log(nc);
      nc.save();
    }
  }

  sendNotification(n, receiverId);

  return n;
};

export const deleteNotification = async (
  receiverId: string,
  notificationId: string
) => {
  let nc = await Notification.findOne({ receiverId: receiverId });
  if (nc) {
    nc.notifications = nc.notifications.filter(
      (item) => item._id != notificationId
    );
    nc.save();
  }
};
