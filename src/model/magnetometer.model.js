import mongoose from 'mongoose';
import config from 'config';

const Schema = mongoose.Schema;

const MagnetometerSchema = new Schema({
	locationName: {
		type: String,
		required: true,
	},
	points: {
		type: {
			type: String,
			enum: 'Point',
			default: 'Point',
		},
		coordinates: {
			type: [Number],
			default: [0, 0, 0],
		},
	},
}, {timestamps: true});

const MagnetometerModel = mongoose.model(
	`${config.get('db.collectionsName.magnetometer')}`,
	MagnetometerSchema
);

export default MagnetometerModel;
