import express from "express";
import cors from "cors";
import passport from "passport";
import passportMiddleware from "./middlewares/passport";

//swagger
import swaggerUI from "swagger-ui-express";
const swaggerDoc = require("../swagger.json");
import { RegisterRoutes } from "./routes";

require("dotenv").config();

//Initializations
const app = express();

//Settings
app.set("port", process.env.PORT || 5000);

//Middlewares
app.use(cors());
app.use(express.json());

//Passport Middleware
app.use(passport.initialize());
passport.use(passportMiddleware);

//tsoa register routes
RegisterRoutes(app);

//SwaggerUI
app.use("/docs", swaggerUI.serve, swaggerUI.setup(swaggerDoc));

export default app;