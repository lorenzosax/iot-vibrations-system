import sensorDao from '../dao/sensor.dao';
import utils from '../utils';
import _ from 'underscore';

const getVibrationsData = async (limit, location) => {
	let opts = {};
	const sort = {createdAt: -1};
	const lim = limit ? parseInt(limit) : null;
	location ? opts.location = location : null;
	return new Promise(async (resolve, reject) => {
		try {
			let vibrationData = await sensorDao.findMagnetometerData(opts, sort, lim);
			resolve(_.sortBy(vibrationData, 'createdAt'));
		} catch (e) {
			reject();
		}
	});
};

const saveVibrationData = async (vibrationData) => {
	vibrationData.axes.forEach(async (axes) => {
		let obj = {
			location: vibrationData.location,
			axes: axes,
		};
		await sensorDao.saveMagnetometerData(obj);
	});
	return utils.prepareSuccessSentSensorData();
};

const save3axesVibrationData = async (location, x, y, z) => {
	let response;
	const savedVibrationData = await sensorDao
		.save3axesMagnetometerData(location, x, y, z);
	if (savedVibrationData.status !== utils.prepareKO().status) {
		response = utils.prepareSuccessSentSensorData();
	} else {
		response = utils.prepareErrorSendingSensorData(savedVibrationData);
	}
	return response;
};

export default {
	getVibrationsData,
	saveVibrationData,
	save3axesVibrationData,
};
