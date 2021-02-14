import { Context } from "@azure/functions"

module.exports = (context: Context, myTimer: any) => {

    const dbDep: any = require('../SharedFiles/dataBase');

    // Connecting du db to prevent cold start

    const connectWriteClient = () => {

        // if (dbDep.clientWrite == null) {
        dbDep.MongoClient.connect(dbDep.uriWrite, (error, _client) => {

            if (error) {
                context.log('Failed to connect write client');
                context.res = { status: 500, body: 'Failed to connect write client' }
                return context.done();
            }
            dbDep.clientWrite = _client;
            context.log('Connected write client');
            context.done();
        })
        /*  } else {
              context.done();
          }*/
    }

    const connectReadClient = () => {
        // if (dbDep.clientRead == null) {
        dbDep.MongoClient.connect(dbDep.uriRead, (error, _client) => {

            if (error) {
                context.log('Failed to connect read client');
                context.res = { status: 500, body: 'Failed to connect read client' }
                return context.done();
            }
            dbDep.clientRead = _client;
            context.log('Connected read client');
            connectWriteClient();
        })
        /* } else {
             connectWriteClient();
         }*/
    }

    var timeStamp = new Date().toISOString();
    if (myTimer.isPastDue) {
        context.log('Timer function is running late!');
    }
    context.log('Timer trigger function ran!', timeStamp);

    connectReadClient();
};