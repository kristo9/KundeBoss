import { Context, HttpRequest } from "@azure/functions"
import { returnResult } from "../SharedFiles/dataValidation";
import { getKey, options, prepToken, errorQuery, errorUnauthorized } from "../SharedFiles/auth";
import { DBName, connectRead, connectWrite } from "../SharedFiles/dataBase";
import { verify } from "jsonwebtoken";

module.exports = (context: Context, req: HttpRequest): any => {
    let decodedToken = null;

    let token = prepToken(context, req.headers.authorization);

    if (token === null) {
        return context.done();
    }

    const authorize = (client: { db: (arg0: string) => any }) => {
        verify(token, getKey, options, (err: any, decoded: { [x: string]: any; }) => {
            // verified and decoded token
            if (err) {
                errorUnauthorized(context, "Token not valid");
                return context.done();
            }
            else {
                decodedToken = decoded;
                functionQuery(client);
            }
        });
    };

    let query = JSON.parse("{}");
    query["name"] = null;
    query["employeeId"] = null;
    query[" customers"] = [];
    query["admin"] = null;
    query["customer"] = null;

    const functionQuery = (client: { db: (arg0: string) => any }) => {
        client.db(DBName).collection("employee").find().project({ "_id": 0, "employeeId": 1 }).toArray((error: any, docs: JSON[]) => {
            if (error) {
                errorQuery(context);
                return context.done();
            }
            else {
                if (docs.length === 0) {
                    connectWrite(context, firstEmployee);
                }
                else if (JSON.stringify(docs).includes(decodedToken["preferred_username"]) === false) {
                    connectWrite(context, createEmplyee);
                }
                else {
                    let result: JSON = JSON.parse("{}");

                    result["name"] = decodedToken["name"];
                    result["firstLogin"] = false;

                    returnResult(context, result);
                    context.done();
                }
            }
        });
    };

    const firstEmployee = (client: { db: (arg0: string) => any }) => {
        context.log("Creating first employee with admin:write");
        query["admin"] = "write";
        createEmplyee(client);
    };

    const createEmplyee = (client: { db: (arg0: string) => any }) => {
        query["name"] = decodedToken["name"];
        query["employeeId"] = decodedToken["preferred_username"];

        client.db(DBName).collection("employee").insertOne(query, (error: any, docs: JSON | JSON[]) => {
            if (error) {
                errorQuery(context);
                return context.done();
            }
            context.log("New employee created");

            let result: JSON = JSON.parse("{}");

            result["name"] = decodedToken["name"];
            result["firstLogin"] = true;

            returnResult(context, result);
            context.done();
        });
    }

    connectRead(context, authorize);
};