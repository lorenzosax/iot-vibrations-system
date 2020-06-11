import utils from '../utils';
import MagnetometerModel from '../model/magnetometer.model';

const findAllMagnetometerData = async (user) => {
	return MagnetometerModel.find()
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
	findAllMagnetometerData,
	saveMagnetometerData,
};
