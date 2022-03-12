import { format, transports, createLogger } from "winston";

const logFormat = format.printf(({ level, message, timestamp, stack }) => {
	return `${timestamp} ${level}: ${stack || message}`;
});

export default createLogger({
	format: format.combine(
		format.colorize(),
		format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
		format.errors({ stack: true }),
		logFormat
	),
	transports: [new transports.Console()],
});