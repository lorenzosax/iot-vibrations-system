import sensorDao from '../dao/sensor.dao';
import utils from '../utils';
import _ from 'underscore';

const getAllVibrationsData = async () => {
	let vibrationData = await sensorDao.findMagnetometerData();
	return new Promise((resolve, reject) => {
		resolve(vibrationData);
	});
};

const getLastXVibrationsData = async (numOfElToTake) => {
	const sort = {createdAt: -1};
	return new Promise(async (resolve, reject) => {
		try {
			const limit = parseInt(numOfElToTake);
			let vibrationData = await sensorDao
				.findMagnetometerData({}, sort, limit);
			resolve(_.sortBy(vibrationData, 'createdAt'));
		} catch (e) {
			reject();
		}
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
	getLastXVibrationsData,
	saveVibrationData,
};
