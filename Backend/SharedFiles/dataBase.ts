module.exports.MongoClient = require('mongodb').MongoClient;
module.exports.assert = require('assert');
module.exports.ObjectId = require('mongodb').ObjectID;
module.exports.url = "mongodb://kundebossmongodb:GHLql0AhgKRnqQVp63pp88C96GmIbC7tkzXpaUfxtbyll5IlPsHyeL7YMb0tWeFbnbAU8Iu8RTYXkX5Bu2bOfA==@kundebossmongodb.mongo.cosmos.azure.com:10255/?ssl=true&appName=@kundebossmongodb@";
//module.exports.url = "mongodb://localhost:27017/?readPreference=primary&appname=MongoDB%20Compass&ssl=false";
module.exports.DBName = "KundeBossDB";
module.exports.client = () => this.MongoClient(this.url, { serverSelectionTimeoutMS: 10000, useUnifiedTopology: true, useNewUrlParser: true }).connect();

