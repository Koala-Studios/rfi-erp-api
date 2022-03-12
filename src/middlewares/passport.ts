import { PassportStatic } from "passport";
import { ExtractJwt, Strategy, StrategyOptions } from "passport-jwt";
import config from "../config/config";
import User from "../models/user.model";

const opts: StrategyOptions = {
	jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
	secretOrKey: config.jwtSecret,
};

export default new Strategy(opts, async (payload, done) => {
	try {
		const user = await User.findById(payload.id);

		if (user) {
			done(null, user);
			return Promise.resolve(user);
		}

		done(null, false);
		return Promise.reject();
	} catch (err) {
		console.log(err);
	}
});