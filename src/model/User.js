import mongoose from 'mongoose';
import config from 'config';

const Schema = mongoose.Schema;

const UserSchema = new Schema({
	email: {
		type: String,
		unique: true,
		trim: true,
		required: true,
	},
	password: {
		type: String,
		required: true,
	},
	verifiedCode: {
		type: String,
		required: true,
	},
	verified: {
		type: Boolean,
		required: true,
	},
	createdAt: {type: Date, default: Date.now},
});

const User = mongoose.model(
	`${config.get('db.collectionsName.user')}`,
	UserSchema
);

export default User;
