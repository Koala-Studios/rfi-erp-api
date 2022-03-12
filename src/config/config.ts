export default {
	jwtSecret: process.env.JWT_SECRET || "secrettoken",
	DB: {
		URI: "mongodb://localhost/rfi_db",
		USER: process.env.MONGODB_USER,
		PASSWORD: process.env.MONGODB_PASSWORD,
	},
};