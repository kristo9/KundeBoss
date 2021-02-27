import { Context } from "@azure/functions"
import { connectRead, connectWrite, DBName } from "../SharedFiles/dataBase";

export default (context: Context, myTimer: any) => {
    // Connecting du db to prevent cold start
    var timeStamp = new Date().toISOString();

    if (myTimer.isPastDue) {
        context.log("Timer function is running late!");
    }
    context.log("Timer trigger function ran!", timeStamp);

    connectRead(context, () => {
        connectWrite(context, (client) => {
            client.db(DBName).collection("employee").find().project({ "_id": 0, "employeeId": 1 }).toArray((error, docs) => {
                if (error) {
                    context.log("Error running query");
                } else {
                    context.log("Employees in db: " + docs.length);
                    context.log("Successfully connected both clients and queried database");
                }
                context.done();
            });
        }, true);
    }, true);
    /*connectRead(context, () => {
        context.done();
    }, true);*/
};