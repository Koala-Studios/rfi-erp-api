import User, { INotification, IUser } from "../models/user.model";
import { reply, status } from "../config/config.status";
import { IListParams, ILogicResponse } from "./interfaces.logic";



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
  const list = await User.find({ name: new RegExp(searchValue,"i") }).limit(15);

  return { status: status.OK, data: { message: "", res: list } };
};

export const createNotification = async (
  io,
  userId: string,
  action: number,
  object: string
): Promise<{ action: number; object: string }> => {
  let notification: INotification = {
    _id: null,
    action: action,
    object: object,
  };
  const user = await User.findById(userId);
  user.notifications.push(notification);
  user.save();

  notification = user.notifications[user.notifications.length - 1];

  //TODO: notify the user

  return notification;
};

export const deleteUserNotification = async (
  userId: string,
  notificationId: string
) => {
  let user = await User.findById(userId);
  if (user) {
    user.notifications = user.notifications.filter(
      (item) => item._id != notificationId
    );
    user.save();
  }
};
