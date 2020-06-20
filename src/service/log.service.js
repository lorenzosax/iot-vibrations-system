import utils from '../utils';
import LogModel from '../model/log.model';

const saveLog = (logData) => {
	let obj = {
		headers: logData.headers,
		body: logData.body,
	};
	const log = new LogModel(obj);
	return log.save()
		.then(() => log)
		.catch((e) => utils.prepareValidatorsResponse(e.errors));
};

export default {
	saveLog,
};
