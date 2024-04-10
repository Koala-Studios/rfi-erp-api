import app from "../app";
import config from "../config/config";
import logger from "../logger/logger";
import send from "./config.socket";
import { initNotifications } from "./notification.socket";
import { userSockets } from "./user.socket";

const httpServer = require("http").createServer(app);
const io = require("socket.io")(httpServer, {
  cors: {
    origin: config.CLIENT,
    methods: ["GET", "POST"],
  },
});

export const initializeSockets = () => {
  initNotifications(io);

  io.on(send.connection, async (socket) => {
    userSockets(io, socket);
  });

  httpServer.listen(5001);
  logger.info("Socket Server Initialized");
};
