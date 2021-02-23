import { Context, HttpRequest } from "@azure/functions"
import { DBName, connectRead } from "../SharedFiles/dataBase";
import { sanitizeHtmlJson, mailVal } from "../SharedFiles/inputValidation";

export default (context: Context, req: HttpRequest): any => {

    req.body = sanitizeHtmlJson(req.body);

    let id = req.body.id;

    const query = {
        "employeeId": id
    };

    const projection = {
        "_id": 0,
        "name": 1,
        "employeeId": 1,
        "customers": 1
    };

    const inputValidation = () => {
        if (req.body && id && mailVal(id)) {

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
            getEmployeeData(client);

        } else {
            context.log("Unauthorized");
            context.res = { status: 401, body: "Unauthorized" }
            return context.done();
        }
    };

    const getEmployeeData = (client) => {
        client.db(DBName).collection("employee").find(query).project(projection).toArray((error, docs) => {

            if (error) {
                context.log("Error running query");
                context.res = { status: 500, body: "Error running query" };
                return context.done();

            } else {
                docs = sanitizeHtmlJson(docs);
                context.log("Success!");
                context.res = {
                    headers: { "Content-Type": "application/json" },
                    body: docs
                };
            }
            context.done();
        });
    };

    inputValidation();
};