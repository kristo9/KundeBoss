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
            getEmployeeData(client);

        } else {
            context.log("Unauthorized");
            context.res = { status: 401, body: "Unauthorized" }
            return context.done();
        }
    };

    const getEmployeeData = (client) => {
        client.db(DBName).collection("ansatte").find(query).project(projection).toArray((error, docs) => {

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