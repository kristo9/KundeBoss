import { Context, HttpRequest } from "@azure/functions"
import { sanitizeHtmlJson, nameVal } from "../SharedFiles/inputValidation";
import { getKey, options, setKeyNull } from "../SharedFiles/auth";
import { verify } from "jsonwebtoken";
import { DBName, connectRead, connectWrite } from "../SharedFiles/dataBase";

module.exports = (context: Context, req: HttpRequest): any => {

    let employeeId: any;
    let token = req.headers.authorization;
    //console.log(token);

    
    if (token)
        token = req.headers.authorization.replace(/^Bearer\s+/, "");
    else {
        context.res = {
            status: 400,
            body: {
                "error": "no token"
            }
        };
        return context.done();
    }

    const authorize = (client) => {
        
        verify(token, getKey, options, (err: any, decoded: { [x: string]: any; }) => {
            // verified and decoded token
            if (err) {
                setKeyNull();
                // invalid token
                context.res = {
                    status: 401,
                    body: {
                        'name': "unauthorized",
                    }
                };
                context.log("invalid token");
                return context.done();
            } else {
                context.log("valid token");
                employeeId = decoded.preferred_username;
                console.log(employeeId);

                client.db(DBName).collection("employee").find({ "employeeId": employeeId }).project({ "admin": 1 }).toArray((error, docs) => {

                    if (error) {
                        context.log("Error running query");
                        context.res = { status: 500, body: "Error running query" };
                        return context.done();

                    } else {
                        if (docs[0].admin === "write")
                            functionQuery(client);
                        else {
                            context.res = {
                                status: 401, body: {
                                    'name': "ERROR: Need higher access level"
                                }
                            };
                            context.log("Accessed by user without admin permission");
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


    const functionQuery = (client) => {
        
        client.db(DBName).collection("employee").find().project(projection).toArray((error, docs) => {
            if (error) {
                context.log('Error running query');
                context.res = { status: 500, body: 'Error running query' }
                return context.done();
            }

            docs = sanitizeHtmlJson(docs);

            context.log('Success!');
            context.res = {
                headers: { 'Content-Type': 'application/json' },
                body: docs
            };
            context.done();
        });
    };

    connectRead(context, authorize);
};