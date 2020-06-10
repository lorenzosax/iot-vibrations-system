import mongoose from 'mongoose';
import config from 'config';
import queryString from 'query-string';

const configDB = config.get('db');

const generateDBurl = () => {
	const hosts = configDB.hosts.join(',');
	const options = queryString.stringify(configDB.options);
	return configDB.protocol +
		configDB.user + ':' + configDB.pwd + '@' + hosts +
		'/' + configDB.name + '?' + options;
};

const dbURL = generateDBurl();

const run = async () => {
	mongoose.set('useNewUrlParser', true);
	mongoose.set('useFindAndModify', false);
	mongoose.set('useCreateIndex', true);
	mongoose.connection.on('connected', () => {
		console.log('Mongoose default connection is open...');
	});

	mongoose.connection.on('error', () => {
		console.log('Mongoose default connection has occured error');
	});

	mongoose.connection.on('disconnected', () => {
		console.log('Mongoose default connection is disconnected');
	});

	process.on('SIGINT', () => {
		mongoose.connection.close(() => {
			console.log('Mongoose connection is disconnected');
			process.exit(0);
		});
	});
	return mongoose.connect(dbURL, {useNewUrlParser: true});
};

export default {
	run,
};
