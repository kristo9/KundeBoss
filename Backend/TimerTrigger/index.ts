import { Context } from "@azure/functions"

const dbDep: any = require('../SharedFiles/dataBase');

module.exports = (context: Context, myTimer: any) => {
    // Connecting du db to prevent cold start

    var timeStamp = new Date().toISOString();
    if (myTimer.isPastDue) {
        context.log('Timer function is running late!');
    }
    context.log('Timer trigger function ran!', timeStamp);

    dbDep.connectWrite(context, () => { dbDep.connectRead(context, () => context.done(), true) }, true);

};