import mongoose from 'mongoose';
import config from 'config';
import wsService from '../service/websocket.service';

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

MagnetometerSchema.post('save', (data) => {
	wsService.emit('sensor', data);
});

const MagnetometerModel = mongoose.model(
	`${config.get('db.collectionsName.magnetometer')}`,
	MagnetometerSchema
);

export default MagnetometerModel;
