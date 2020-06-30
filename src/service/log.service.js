import utils from '../utils';
import LogModel from '../model/log.model';

const saveHttpLog = (httpResponse) => {
	let obj = {
		headers: httpResponse.headers,
		body: httpResponse.body,
		query: httpResponse.query,
	};
	const log = new LogModel(obj);
	return log.save()
		.then(() => log)
		.catch((e) => utils.prepareValidatorsResponse(e.errors));
};

export default {
	saveHttpLog,
};
