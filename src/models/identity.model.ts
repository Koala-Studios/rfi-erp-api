import mongoose from "mongoose";
import bcrypt from "bcrypt";

export interface IIdentity extends mongoose.Document {
	user: string;
	password: string;
	comparePassword: (password: string) => Promise<boolean>;
}

const identitySchema = new mongoose.Schema({
	user: String,
	password: {
		type: String,
		required: true,
		minLength: 5,
	},
});

identitySchema.pre<IIdentity>("save", async function (next) {
	const user = this;

	if (!user.isModified("password")) return next();

	//If user is modifying password create hash for it
	const salt = await bcrypt.genSalt(10);
	const hash = await bcrypt.hash(user.password, salt);
	user.password = hash;
	next();
});

//Compare user password with hash stored in the server
identitySchema.methods.comparePassword = async function <IIdentity>(
	password: string
): Promise<boolean> {
	return await bcrypt.compare(password, this.password);
};

export default mongoose.model<IIdentity>("Identity", identitySchema);