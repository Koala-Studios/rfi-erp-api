import User, { IUser } from "../models/user.model";
import { reply, status } from "../config/config.status";
import { IListParams, ILogicResponse } from "./interfaces.logic";
import { sendNotification } from "../sockets/notification.socket";
import Notification, {
  INotification,
  notificationType,
} from "../models/notification.model";
import mongoose from "mongoose";

export const listUser = async (
  listParams: IListParams
): Promise<ILogicResponse> => {
  const list = await User.paginate(
    {},
    { page: listParams.page, limit: listParams.count, leanWithId: true }
  );

  return {
    status: status.OK,
    data: { message: "", res: list },
  };
};

export const userLookup = async (s_value) => {
  const searchValue = s_value.toString();
  const list = await User.find({ name: new RegExp(searchValue, "i") }).limit(
    15
  );

  return { status: status.OK, data: { message: "", res: list } };
};

export const createNotification = async (
  n: INotification,
  save: boolean, //save notification or not
  receiverId?: string
): Promise<INotification> => {
  if (receiverId && save) {
    let nc = await Notification.findOne({ receiverId: receiverId });
    nc.notifications.push(n);
    nc.save();
  }

  sendNotification(n, receiverId);

  return n;
};
export const textNotification = async (
  text: string,
  save: boolean, //save notification or not
  sender?: string,
  receiverId?: string
): Promise<INotification> => {
  let n: INotification = {
    text,
    sender,
    type: notificationType.text,
  };

  createNotification(n, save, receiverId);
  return n;
};

export const deleteUserNotification = async (
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
