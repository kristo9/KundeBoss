import { Context, HttpRequest } from "@azure/functions"
import { DBName, connectRead } from "../SharedFiles/dataBase";
import { sanitizeHtmlJson, nameVal } from "../SharedFiles/inputValidation";

export default (context: Context, req: HttpRequest): any => {

    req.body = sanitizeHtmlJson(req.body);

    let name = req.body.name;

    const query = {
        id: name
    };

    const projection = {
        "_id": 0,
        "navn": 1,
        "fdato": 1,
        "kontaktInfo.tlf": 1
    };

    const inputValidation = () => {
        if (req.body && name && nameVal(name)) {

            connectRead(context, authorize);

        } else {
            context.res = {
                status: 400,
                body: {
                    error: "Wrong input"
                }
            };
            return context.done();
        }
    };

    const authorize = (client) => {
        if (true) {
            // if valid credentials
            testQuery(client);

        } else {
            context.log("Unauthorized");
            context.res = { status: 401, body: "Unauthorized" }
            return context.done();
        }
    };

    const testQuery = (client) => {
        context.log("test");

        client.db(DBName).collection("employee").find().project({ "_id": 0, "employeeId": 1 }).toArray((error, docs) => {
            if (error) {
                //context.log('Error running query');
                context.res = { status: 500, body: 'Error running query' }
                return context.done();
            }
            else {
                context.log("test2");

                docs = sanitizeHtmlJson(docs);
                context.log(docs);
            }
            context.done();
        });

    };

    inputValidation();
};


