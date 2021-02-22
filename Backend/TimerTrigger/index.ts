import { Context } from "@azure/functions"
import { connectWrite, connectRead } from "../SharedFiles/dataBase";

export default async (context: Context, myTimer: any) => {
    // Connecting du db to prevent cold start

    var timeStamp = new Date().toISOString();
    if (myTimer.isPastDue) {
        context.log("Timer function is running late!");
    }
    context.log("Timer trigger function ran!", timeStamp);

    connectWrite(context, (dummy: any) => {
        connectRead(context, (dummy: any) => {

        }, true);
    }, true);
};