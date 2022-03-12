import devLogger from "./dev-logger";
import prodLogger from "./prod-logger";

export default process.env.NODE_ENV === "development" ? devLogger : prodLogger;