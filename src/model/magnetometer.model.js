import mongoose from 'mongoose';
import config from 'config';
import wsService from '../service/websocket.service';

const Schema = mongoose.Schema;

const MagnetometerSchema = new Schema({
	location: {
		type: String
	},
	axes: {
		type: [Number],
		default: [0, 0, 0],
	},
}, {timestamps: true});

// Legend
// axes[0] -> x
// axes[1] -> y
// axes[2] -> z

MagnetometerSchema.post('save', (data) => {
	wsService.emit('sensor', data);
});

const MagnetometerModel = mongoose.model(
	`${config.get('db.collectionsName.magnetometer')}`,
	MagnetometerSchema
);

export default MagnetometerModel;
