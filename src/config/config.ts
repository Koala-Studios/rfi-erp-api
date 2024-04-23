import dotenv from "dotenv";
require("dotenv").config({ path: "../../.env" });

export default {
  jwtSecret: process.env.JWT_SECRET || "secrettoken",
  DB: {
    URI: process.env.MONGO_URI ?? "mongodb://127.0.0.1/rfi_db_2",
  },
  CLIENT: process.env.CLIENT ?? "http://localhost:3000",
};
