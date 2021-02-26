import { Context, HttpRequest } from "@azure/functions"
import { verify } from "jsonwebtoken";
import { getKey, options, setKeyNull } from "../SharedFiles/auth";
import { DBName, connectRead } from "../SharedFiles/dataBase";
import { sanitizeHtmlJson } from "../SharedFiles/inputValidation";

export default (context: Context, req: HttpRequest): any => {

    let token = req.headers.authorization;

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

    const authorize = (client: any) => {
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
                context.log("valid token");

                functionQuery(client);
            }
        });
    };

    const query = {};

    const projection = {
        "_id": 0
    };

    const functionQuery = (client: any) => {
        client.db(DBName).collection("employee").find(query).project(projection).toArray((error: any, docs: any) => {

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