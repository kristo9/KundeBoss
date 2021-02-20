import { Context } from "@azure/functions"

module.exports = (context: Context, myTimer: any) => {

    const dbDep: any = require('../SharedFiles/dataBase');

    // Connecting du db to prevent cold start

    var timeStamp = new Date().toISOString();
    if (myTimer.isPastDue) {
        context.log('Timer function is running late!');
    }
    context.log('Timer trigger function ran!', timeStamp);

    dbDep.connectWrite(context, (dummy: any) => { dbDep.connectRead(context, (dummy: any) => context.done(), true) }, true);

};