require('dotenv').config();

const nodeEnv = process.env.NODE_ENV || 'development';

const envConfig = {	
	dialect: process.env.DB_CONNECTION,
	host: process.env.DB_HOST,
	port: parseInt(process.env.DB_PORT, 10),
	database: process.env.DB_DATABASE,
	username: process.env.DB_USERNAME,
	password: process.env.DB_PASSWORD,
	logging: false,
};

// TODO ORM 操作全部log起來
const envORMConfig = {
	dialect: process.env.DB_CONNECTION,
	host: process.env.DB_HOST,
	port: parseInt(process.env.DB_PORT, 10),
	database: process.env.DB_DATABASE,
	username: process.env.DB_USERNAME,
	password: process.env.DB_PASSWORD,
	logging: console.log,
	options: {
		trustServerCertificate: true,
	}
};

const envTestConfig = {
	dialect: process.env.TEST_DB_CONNECTION,
	host: process.env.TEST_DB_HOST,
	port: parseInt(process.env.TEST_DB_PORT, 10),
	database: process.env.TEST_DB_DATABASE,
	username: process.env.TEST_DB_USERNAME,
	password: process.env.TEST_DB_PASSWORD,
	logging: false,
};


module.exports = {
	[nodeEnv]: envConfig,
	'test' : envTestConfig,
	'ORM' : envORMConfig
};
