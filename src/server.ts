import app from "./app";
import "./database";
import logger from "./logger/logger";
import { initializeSockets } from "./sockets/socket";

app.listen(app.get("port"), () => {
  return logger.info(`server is listening on ${app.get("port")}`);
});

initializeSockets();
