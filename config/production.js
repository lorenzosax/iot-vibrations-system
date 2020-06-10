const PORT = process.env.PORT || 4000;
const DB_USR = process.env.DB_USR || '';
const DB_PWD = process.env.DB_PWD || '';
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
const GMAIL_USR = process.env.GMAIL_USR;
const GMAIL_PWD = process.env.GMAIL_PWD;

module.exports = {
	app: {
		name: 'iot-sensors-data',
		version: '1.0.0',
		port: PORT,
		baseUrl: `https://misure2020.herokuapp.com`,
	},
	authentication: {
		secretKey: JWT_SECRET_KEY,
		optionsSign: {
			expiresIn: '24h',
		},
		salts: 10,
		gmail: {
			user: GMAIL_USR,
			password: GMAIL_PWD,
		},
	},
	randomStringOptions: {
		length: 32,
		charset: 'alphanumeric',
	},
	db: {
		protocol: 'mongodb://',
		user: DB_USR,
		pwd: DB_PWD,
		hosts: [
			'cluster0-shard-00-00-ntyou.mongodb.net:27017',
			'cluster0-shard-00-01-ntyou.mongodb.net:27017',
			'cluster0-shard-00-02-ntyou.mongodb.net:27017',
		],
		name: 'streams',
		options: {
			ssl: true,
			replicaSet: 'Cluster0-shard-0',
			authSource: 'admin',
			retryWrites: true,
		},
		collectionsName: {
			user: 'user',
		},
	},
};
