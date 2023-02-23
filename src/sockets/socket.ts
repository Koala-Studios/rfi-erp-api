import app from "../app";
import logger from "../logger/logger";
import send from "./config.socket";
import { initNotifications } from "./notification.socket";
import { userSockets } from "./user.socket";

const httpServer = require("http").createServer(app);
const io = require("socket.io")(httpServer, {
  cors: {
    origin: "http://localhost:3000",
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
