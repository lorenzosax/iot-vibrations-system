import utils from '../utils';
import MagnetometerModel from '../model/magnetometer.model';

const findMagnetometerData = async (options, sort, limit) => {
	const lim = limit < 200 ? limit : 200;
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

export default {
	findMagnetometerData,
	saveMagnetometerData,
};