export default {
  jwtSecret: process.env.JWT_SECRET || "secrettoken",
  DB: {
    URI: "mongodb://127.0.0.1/rfi_db_2",
    USER: process.env.MONGODB_USER,
    PASSWORD: process.env.MONGODB_PASSWORD,
  },
};
