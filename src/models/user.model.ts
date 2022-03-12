import mongoose from "mongoose";

export interface INotification {
	_id: string;
	action: number;
	object: string;
}

export interface IUser extends mongoose.Document {
	email: string;
	username: string;
	photo: string;
	identities: string[];
	notifications: INotification[];
}

export const notificationMap = {
	team_invite: 1,
	friend_request: 2,
	project_invite: 3,
};

const userSchema = new mongoose.Schema({
	email: {
		type: String,
		required: true,
		unique: true,
		trim: true,
		lowercase: true,
	},
	username: {
		type: String,
		required: true,
		unique: true,
		trim: true,
		lowercase: true,
		minLength: 3,
	},
	identities: [String],
	notifications: [
		{
			action: Number, //refers to type of action eg. add friend, comment, etc..
			object: String, // an id refering to the team, user, or a description
		},
	]
});

userSchema.pre<IUser>("save", async function (next) {
	const user = this;
	if (!user.isModified("username")) return next();

	user.username = user.username.toLowerCase();

	next();
});

export default mongoose.model<IUser>("User", userSchema);