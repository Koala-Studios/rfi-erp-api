import { format, transports, createLogger } from "winston";

const filename = (): string => {
	let date = new Date();

	return (
		date.getFullYear().toString() +
		"-" +
		(date.getMonth() + 1).toString().padStart(2, "0") +
		"-" +
		date.getDate().toString().padStart(2, "0")
	);
};

export default createLogger({
	level: "info",
	format: format.combine(
		format.timestamp(),
		format.errors({ stack: true }),
		format.json()
	),
	transports: [
		new transports.File({
			filename: `logs/${filename()}`,
		}),
		new transports.Console(),
	],
});