var config = module.exports = {};

config.env = 'development';
config.hostname = 'http://localhost';
config.port = 3000;

config.mongo = {};
config.mongo.uri = process.env.MONGO_URI || 'localhost';
config.mongo.db = 'vacaciones_permanentes';
config.mongo.connectionString = 'mongodb://' + config.mongo.uri + '/' + config.mongo.db;

config.auth = {};
config.auth.secret = 'SOMESECRET';

config.log = {};
config.log.level = 'warn';
