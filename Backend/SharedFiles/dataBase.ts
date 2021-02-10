module.exports.MongoClient = require('mongodb').MongoClient;
module.exports.assert = require('assert');
module.exports.ObjectId = require('mongodb').ObjectID;
module.exports.url = "mongodb://comsosmongodb:yPxlq7XJKybeleg9FMt7bHmogb3u8iRFLOhmZBJvmDgIRZbK7chccwYqt9O3EeDs5ghJAMB7hTxmkgUGPiEm1A==@comsosmongodb.mongo.cosmos.azure.com:10255/?ssl=true&appName=@comsosmongodb@";
//module.exports.url = "mongodb://localhost:27017/?readPreference=primary&appname=MongoDB%20Compass&ssl=false";
module.exports.DBName = "KundeBossDB";
module.exports.client = () => this.MongoClient(this.url, { serverSelectionTimeoutMS: 10000, useUnifiedTopology: true, useNewUrlParser: true }).connect();
