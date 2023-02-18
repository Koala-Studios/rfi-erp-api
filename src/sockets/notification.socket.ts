import send from "./config.socket";
import User from "../models/user.model";
import { INotification } from "../models/notification.model";

let _io;

export const initNotifications = (io) => {
  _io = io;
};

//TODO:add ability to send to a group of users, like only users with a certain role
export const sendNotification = (
  notification: INotification,
  receiverId?: string
) => {
  if (!_io) return;

  console.log(notification, receiverId);

  if (receiverId) {
    //send to one user
    _io.to(receiverId).emit(send.notification, notification);
    // _io.emit(send.notification, notification);
  } else {
    //send to all users
    _io.emit(send.notification, notification);
  }
};
