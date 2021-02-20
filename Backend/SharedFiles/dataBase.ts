const MongoClient = require('mongodb').MongoClient;
const config = { useNewUrlParser: true, useUnifiedTopology: true };
//const ObjectId = require('mongodb').ObjectID;
const uriRead = "mongodb://kundebossmongodb:xakwppy4qPl6gkC5fWAYMLvq3SFaL3WOxi1SNgNRdbwCe0hffcyc35kzTcXwKP8VOFQlvczfrjA6fw8HcEdH9g==@kundebossmongodb.mongo.cosmos.azure.com:10255/?ssl=true&replicaSet=globaldb&retrywrites=false&maxIdleTimeMS=200000&appName=@kundebossmongodb@";
const uriWrite = "mongodb://kundebossmongodb:GHLql0AhgKRnqQVp63pp88C96GmIbC7tkzXpaUfxtbyll5IlPsHyeL7YMb0tWeFbnbAU8Iu8RTYXkX5Bu2bOfA==@kundebossmongodb.mongo.cosmos.azure.com:10255/?ssl=true&replicaSet=globaldb&retrywrites=false&maxIdleTimeMS=200000&appName=@kundebossmongodb@";
//module.exports.uriRead = "mongodb://localhost:27017/?readPreference=primary&appname=MongoDB%20Compass&ssl=false";
//module.exports.clientRead = () => this.MongoClient(this.uriRead).connect(); //serverSelectionTimeoutMS: 10000, useUnifiedTopology: true, useNewUriParser: true 
let clientRead = null;
let clientWrite = null;

module.exports.DBName = "KundeBossDB";

module.exports.connectRead = (context, callback: (arg0: any) => void, overrideTest = false) => {
    if ((clientRead == null || !clientRead.isConnected()) || overrideTest) {
        MongoClient.connect(uriRead, config, (error, _client) => {
            if (error) {

                context.log('Failed to connect read client');
                context.res = { status: 500, body: 'Failed to connect' };
                return context.done();
            }
            clientRead = _client;
            context.log('Connected read client');
            callback(clientRead);
        });
    }
    else {
        callback(clientRead);
    }
};

module.exports.connectWrite = (context, callback: (arg0: any) => void, overrideTest = false) => {
    if ((clientWrite == null || !clientWrite.isConnected()) || overrideTest) {
        MongoClient.connect(uriWrite, config, (error, _client) => {
            if (error) {

                context.log('Failed to connect');
                context.res = { status: 500, body: 'Failed to connect write client' };
                return context.done();
            }
            clientWrite = _client;
            context.log('Connected write client');
            callback(clientWrite);
        });
    }
    else {
        callback(clientWrite);
    }
};
