import passport from "passport";
import { Request } from "express";

export async function expressAuthentication(
	request: Request,
	securityName: string,
	scopes?: string[]
): Promise<any> {
	const strategy: any = passport.authenticate("jwt", {
		session: false,
	});

	const authResult = await new Promise((resolve, reject) =>
		strategy(request, request.res, (err) => {
			if (err) {
				reject(err);
			} else {
				resolve(request.user);
			}
		})
	);
	return authResult;
}