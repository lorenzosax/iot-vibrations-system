import mongoose from 'mongoose';
import config from 'config';

const Schema = mongoose.Schema;

const LogSchema = new Schema({
	body: {
		type: Object,
	},
}, {timestamps: true});

const LogModel = mongoose.model(
	`${config.get('db.collectionsName.log')}`,
	LogSchema
);

export default LogModel;
