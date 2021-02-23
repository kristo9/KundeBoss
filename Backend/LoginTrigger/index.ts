import { Context, HttpRequest } from "@azure/functions"
import { sanitizeHtmlJson } from "../SharedFiles/inputValidation";
import { getKey, options, setKeyNull } from "../SharedFiles/auth";
import { DBName, connectRead, connectWrite } from "../SharedFiles/dataBase";
import { verify } from "jsonwebtoken";

module.exports = (context: Context, req: HttpRequest): any => {

    let token = req.headers.authorization;

    let decodedToken = null;

    if (token) {
        token = req.headers.authorization.replace(/^Bearer\s+/, "");
    }
    else {
        context.res = {
            status: 400,
            body: {
                "error": "no token"
            }
        };
        return context.done();
    }


    const inputValidation = () => {
        connectRead(context, authorize);
    };


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
            }
            else {
                decodedToken = decoded;
                context.log("valid token");

                functionQuery(client);
            }
        });
    };


    const functionQuery = (client) => {
        client.db(DBName).collection("employee").find().project({ "_id": 0, "employeeId": 1 }).toArray((error, docs) => {
            if (error) {
                context.log('Error running query');
                context.res = { status: 500, body: 'Error running query' };

                return context.done();
            }
            else {
                if (docs.length === 0) {
                    connectWrite(context, firstEmployee);
                }
                else if (JSON.stringify(docs).includes(decodedToken["preferred_username"]) === false) {
                    connectWrite(context, firstLogin);
                }
                else {
                    context.res = {
                        status: 200,
                        body: {
                            "name": decodedToken["name"],
                            "issued-by": decodedToken["iss"],
                            "issued-for": decodedToken["aud"],
                            "using-scope": decodedToken["scp"]
                        }
                    };
                    context.done();
                }
            }
        });
    };


    const firstEmployee = (client) => {
        context.log("Creating first employee with admin:write");

        const query = {
            "name": decodedToken["name"],
            "employeeId": decodedToken["preferred_username"],
            "customers": [],
            "admin": "write"
        };
        createEmplyee(client, query);
    };


    const firstLogin = (client) => {
        context.log("Creating new employee");

        const query = {
            "name": decodedToken["name"],
            "employeeId": decodedToken["preferred_username"],
            "customers": [],
            "admin": null
        };
        createEmplyee(client, query);
    };


    const createEmplyee = (client, query) => {
        client.db(DBName).collection("employee").insertOne(query, (error, docs) => {
            if (error) {
                context.log("Error running query");
                context.res = { status: 500, body: "Error running query" };
                return context.done();
            }

            docs = sanitizeHtmlJson(docs);

            context.log("New employee created");
            context.res = {
                headers: { "Content-Type": "application/json" },
                body: {
                    "name": decodedToken["name"] + ", contact system admin to set up account",
                    "docs": docs
                }
            };
            context.done();
        });
    }

    inputValidation();
};