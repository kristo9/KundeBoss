import { Context, HttpRequest } from "@azure/functions"
import { returnResult } from "../SharedFiles/dataValidation";
import { getKey, options, prepToken, errorQuery, errorUnauthorized } from "../SharedFiles/auth";
import { verify } from "jsonwebtoken";
import { DBName, connectRead } from "../SharedFiles/dataBase";

module.exports = (context: Context, req: HttpRequest): any => {
    let employeeId: any;
    //console.log(token);
    let token = prepToken(context, req.headers.authorization)

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
                employeeId = decoded.preferred_username;
                console.log(employeeId);

                client.db(DBName).collection("employee").find({ "employeeId": employeeId }).project({ "admin": 1 }).toArray((error: any, docs: JSON | JSON[]) => {

                    if (error) {
                        errorQuery(context);
                        return context.done();
                    }
                    else {
                        if (docs[0].admin === "write") {
                            functionQuery(client);
                        }
                        else {
                            errorUnauthorized(context, "User dont have admin-write permission");
                            return context.done();
                        }
                    }
                });
            }
        });
    };

    // TODO: Projection,  Only for retrieving data
    const projection = {
        "_id": 0,
        "name": 1,
        "employeeId": 1,
        "admin": 1,
        "customer": 1
    };

    const functionQuery = (client: { db: (arg0: string) => any }) => {
        client.db(DBName).collection("employee").find().project(projection).toArray((error: any, docs: JSON) => {
            if (error) {
                errorQuery(context);
                return context.done();
            }
            returnResult(context, docs)
            context.done();
        });
    };

    connectRead(context, authorize);
};