import config from "./config/config";
import mongoose, { ConnectOptions } from "mongoose";
import logger from "./logger/logger";

//Connect with mongoDB server
const uri = process.env.MONGODB_URI;


mongoose.connect(config.DB.URI);
const connection = mongoose.connection;

connection.once("open", () => {
	logger.info("MongoDB connection established");
});

connection.on("error", (err) => {
	logger.error(err);
	process.exit(0);
});