import { Sequelize, SequelizeOptions } from 'sequelize-typescript'
import * as _ from 'underscore';
import { Config } from '../config/index'

// TODO : Sharding 적용을 위해 다수의 DB 정보를 받을 수 있도록 수정 필요
const _config = {
	DB_USE: true,
	DB_INFO: [
		{
			DB_HOST: Config.DATABASE.DB_1_HOST,
			DB_SCHEMA: Config.DATABASE.DB_1_SCHEMA,
			DB_USER: Config.DATABASE.DB_1_USER,
			DB_PASSWORD: Config.DATABASE.DB_1_PASSWORD
		}
	]
} 

class SequelizeManager {
	_db: Array<Sequelize> = [];

	constructor() {

	}	

	async connect() {	
		console.log(`DB Connecting ...`);
		if (_config.DB_USE) {
			_.each(_config.DB_INFO, (elem, idx) => {
				const option: SequelizeOptions = {
					//database: elem.DB_HOST,
					dialect: 'mariadb',
					models: [__dirname + '/models']
				}
	
				this._db[idx] = new Sequelize(
					elem.DB_SCHEMA, 
					elem.DB_USER, 
					elem.DB_PASSWORD, 
					option,
				);
			})
		}
	}

	async close() {
		console.log(`DB Disconnecting ...`);

		if (_config.DB_USE) {
			this._db.map(function(elem) {
				elem.close();
			});
		}
	}

	async sync() {
		console.log(`DB Sync ...`);

		if (_config.DB_USE) {
			this._db.map(function(elem) {
				elem.sync();
			});
		}
	}
}

export default SequelizeManager;