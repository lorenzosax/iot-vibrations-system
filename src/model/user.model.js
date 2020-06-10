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
}, {timestamps: true});

const UserModel = mongoose.model(
	`${config.get('db.collectionsName.user')}`,
	UserSchema
);

export default UserModel;
