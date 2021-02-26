import { Context, HttpRequest } from "@azure/functions"
import { sanitizeHtmlJson, nameVal } from "../SharedFiles/inputValidation";
import { getKey, options, setKeyNull } from "../SharedFiles/auth";
import { verify } from "jsonwebtoken";
import { DBName, connectRead, connectWrite } from "../SharedFiles/dataBase";

module.exports = (context: Context, req: HttpRequest): any => {

    let employeeId, authLevel;
    let token = req.headers.authorization;
    
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


    const inputValidation = () => {

        //TODO: Checks to see if inputs are valid

        if (/* If vaiid inputs are */ true) {

            connectRead(context, authorize);

        } else {
            context.res = {
                status: 400,
                body: {
                    // TODO:
                    error: "Appropriate error message"
                }
            };
            return context.done();
        }
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
            } else {
                //TODO Verify that user has permission to do what is asked
                context.log("valid token");
                employeeId = decoded.preferred_username;
                
                //authLevel = getAuthLevel;
                if (authLevel == "write") {
                    functionQuery(client);
                } else {

                    // not authorizazed
                    context.res = {
                        status: 401,
                        body: {
                            'name': "unauthorized",
                        }
                    };
                    context.log("not authorizazed");
                    return context.done();
                }
            }
            context.done();
        });
    };

    // TODO: Query to run on database
    const query = {

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

        /* TODO: add collection name
        
        if inserting : client.db(DBName).collection("Collection Name").insertOne(query, (error, docs) => {*/
        client.db(DBName).collection("employee").find(query).project(projection).toArray((error, docs) => {
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

    inputValidation();
};