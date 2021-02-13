module.exports.MongoClient = require('mongodb').MongoClient;
module.exports.assert = require('assert');
module.exports.ObjectId = require('mongodb').ObjectID;
module.exports.uriRead = "mongodb://kundebossmongodb:xakwppy4qPl6gkC5fWAYMLvq3SFaL3WOxi1SNgNRdbwCe0hffcyc35kzTcXwKP8VOFQlvczfrjA6fw8HcEdH9g==@kundebossmongodb.mongo.cosmos.azure.com:10255/?ssl=true&replicaSet=globaldb&retrywrites=false&maxIdleTimeMS=120000&appName=@kundebossmongodb@";
module.exports.uriWrite = "mongodb://kundebossmongodb:GHLql0AhgKRnqQVp63pp88C96GmIbC7tkzXpaUfxtbyll5IlPsHyeL7YMb0tWeFbnbAU8Iu8RTYXkX5Bu2bOfA==@kundebossmongodb.mongo.cosmos.azure.com:10255/?ssl=true&replicaSet=globaldb&retrywrites=false&maxIdleTimeMS=120000&appName=@kundebossmongodb@";
//module.exports.uriRead = "mongodb://localhost:27017/?readPreference=primary&appname=MongoDB%20Compass&ssl=false";
module.exports.DBName = "KundeBossDB";

//module.exports.clientRead = () => this.MongoClient(this.uriRead).connect(); //serverSelectionTimeoutMS: 10000, useUnifiedTopology: true, useNewUriParser: true 
let clientGlobalRead = null;
let clientGlobalWrite = null;

module.exports.clientRead = () => {

    if (clientGlobalRead == null) {
        clientGlobalRead = this.MongoClient(this.uriRead).connect();
        console.log("Created new read connection");
    }

    return clientGlobalRead;
}; //serverSelectionTimeoutMS: 10000, useUnifiedTopology: true, useNewUriParser: true 

module.exports.clientWrite = () => {

    if (clientGlobalWrite == null) {
        clientGlobalWrite = this.MongoClient(this.uriWrite).connect();
        console.log("Created new write connection");
    }

    return clientGlobalWrite;
};

