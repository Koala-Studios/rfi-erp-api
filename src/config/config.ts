export default {
	jwtSecret: process.env.JWT_SECRET || "secrettoken",
	DB: {
		URI: process.env.MONGODB_URI || "mongodb://localhost/striveserver",
		USER: process.env.MONGODB_USER,
		PASSWORD: process.env.MONGODB_PASSWORD,
	},
};