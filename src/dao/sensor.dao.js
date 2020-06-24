import utils from '../utils';
import MagnetometerModel from '../model/magnetometer.model';

const findMagnetometerData = async (options, sort, limit) => {
	const lim = limit && limit < 200 ? limit : 200;
	const opts = options || {};
	const sorting = sort || {};
	return MagnetometerModel.find(opts).sort(sorting).limit(lim)
		.then((res) => {
			return res;
		}).catch((err) => err);
};


const saveMagnetometerData = async (magnetometerData) => {
	const magData = new MagnetometerModel(magnetometerData);
	return magData.save()
		.then(() => magData)
		.catch((e) => utils.prepareValidatorsResponse(e.errors));
};

const save3axesMagnetometerData = async (location, x, y, z) => {
	let obj = {
		location: location,
		axes: [x, y, z],
	};
	const magData = new MagnetometerModel(obj);
	return magData.save()
		.then(() => magData)
		.catch((e) => utils.prepareValidatorsResponse(e.errors));
};

export default {
	findMagnetometerData,
	saveMagnetometerData,
	save3axesMagnetometerData,
};
