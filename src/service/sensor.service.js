import sensorDao from '../dao/sensor.dao';
import utils from '../utils';

const getAllVibrationsData = async () => {
	let vibrationData = await sensorDao.findAllMagnetometerData();
	return new Promise((resolve, reject) => {
		resolve(vibrationData);
	});
};

const saveVibrationData = async (vibrationData) => {
	let response;
	const savedVibrationData = await sensorDao
		.saveMagnetometerData(vibrationData);
	if (savedVibrationData.status !== utils.prepareKO().status) {
		response = utils.prepareSuccessSentSensorData();
	} else {
		response = utils.prepareErrorSendingSensorData(savedVibrationData);
	}
	return response;
};

export default {
	getAllVibrationsData,
	saveVibrationData,
};
