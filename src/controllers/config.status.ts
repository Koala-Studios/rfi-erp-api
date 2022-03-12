export const status = {
	OK: 200,
	CREATED: 201,
	BAD_REQUEST: 400,
	UNAUTHORIZED: 401,
	FORBIDDEN: 403,
	NOT_FOUND: 404,
	CONFLICT: 409,
	SERVER_ERROR: 500,
};

export const reply = {
	required_fields: "required fields not filled",
	short_password: "password is too short",
	email_exist: "email is already in use",
	username_exist: "username is already in use",
	success: "Success",
	user_not_found: "user does not exist",
	incorrect_login: "password or username incorrect",
	id_not_found: "Given Id was not found",
};