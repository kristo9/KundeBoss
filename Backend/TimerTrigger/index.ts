import { Context } from "@azure/functions"

module.exports = async (context: Context, myTimer: any): Promise<void> => {

    const dbDep: any = require('../SharedFiles/dataBase');

    // Connecting du db to prevent cold start

    try {
        // Connect to db
        await dbDep.clientRead();
        await dbDep.clientWrite();

        context.log('Warmed up connection to database');

    } catch {
        context.log("Could not connect to database");
    }

    var timeStamp = new Date().toISOString();
    if (myTimer.isPastDue) {
        context.log('Timer function is running late!');
    }
    context.log('Timer trigger function ran!', timeStamp);
};