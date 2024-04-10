export default {
  jwtSecret: process.env.JWT_SECRET || "secrettoken",
  DB: {
    URI: "mongodb+srv://orejas63:M1Y9AldB7CaLWnEG@cluster0.vt25uox.mongodb.net/rfi_db",
  },
  CLIENT: "https://rfi-client.netlify.app:3000",
};
