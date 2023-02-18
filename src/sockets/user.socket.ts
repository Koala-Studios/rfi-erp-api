import User from "../models/user.model";
import { deleteUserNotification } from "../logic/user.logic";
import send from "./config.socket";
import logger from "../logger/logger";

export const userSockets = async (io, socket) => {
  //TODO:use handshake.auth to authenticate connection
  console.log(socket.handshake.query.userId);

  const user = await User.findById(socket.handshake.query.userId);

  if (user !== null) {
    socket.join(socket.handshake.query.userId);

    logger.info(`User connected:${user.username}`);
  }

  //   socket.on(send.initial_data, async (userId) => {
  //     socket.userId = userId;
  //     const user = await User.findById(userId);

  //     if (user !== null) {
  //       socket.join(socket.userId);

  //       logger.info(`User connected:${user.username}`);
  //     }
  //   });

  socket.on(send.user_disconnected, () => {
    socket.broadcast.emit(send.user_disconnected);
  });

  socket.on(send.delete_notification, (notificationId: string) => {
    deleteUserNotification(socket.userId, notificationId);
  });
};
