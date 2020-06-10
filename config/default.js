const PORT = process.env.PORT || 3000;
const DB_USR = process.env.DB_USR || '';
const DB_PWD = process.env.DB_PWD || '';

module.exports = {
	app: {
		name: 'iot-sensors-data',
		version: '1.0.0',
		port: PORT,
		baseUrl: `http://localhost:${PORT}`,
	},
	authentication: {
		secretKey: '183kJjsnIOkaudhe11POALL8sxow221',
		optionsSign: {
			expiresIn: '24h',
		},
		salts: 10,
		gmail: {
			user: '',
			password: '',
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
