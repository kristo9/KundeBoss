import { Context } from "@azure/functions"

module.exports = async (context: Context, myTimer: any): Promise<void> => {

    var timeStamp = new Date().toISOString();
    if (myTimer.isPastDue) {
        context.log('Timer function is running late!');
    }
    context.log('Timer trigger function ran!', timeStamp);
};