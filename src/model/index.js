// TODO CASCADE fix
// TODO one key reset database

import fs from 'fs';
import path from 'path';

import _ from 'lodash';
import Sequelize from 'sequelize';

import databaseConfig from '../config/database';

const basename = path.basename(__filename);

const env = process.env.NODE_ENV || 'development';
const config = _.get(databaseConfig, env, {});
let sequelize = null;

if (config.use_env_variable) {
	sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
	sequelize = new Sequelize(config.database, config.username, config.password, config);
}

// load model.js file recursively
const loadModel = (file, dir) => {
	if (file.slice(-3) !== '.js') {
		fs
			.readdirSync(path.join(dir, file))
			.filter(file => (file.indexOf('.') !== 0) && (file !== basename))
			.forEach(subFile => {
				loadModel(subFile, path.join(dir, file));
			});
	} else {
		console.log(`${file} is loaded.`);
		const model = _.invoke(sequelize, 'import', path.join(dir, file));
		db[model.name] = model;
	}
};

const db = {};

loadModel('', __dirname);

Object.keys(db).forEach((modelName) => {
	if (db[modelName].associate) {
		db[modelName].associate(db);
	}
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;
