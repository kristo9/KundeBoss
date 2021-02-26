import { Context, HttpRequest } from "@azure/functions"
import { sanitizeHtmlJson, nameVal, mailVal } from "../SharedFiles/inputValidation";
import { getKey, options, setKeyNull } from "../SharedFiles/auth";
import { verify } from "jsonwebtoken";
import { DBName, connectRead, connectWrite } from "../SharedFiles/dataBase";

module.exports = (context: Context, req: HttpRequest): any => {


    if (req.body) {
        req.body = sanitizeHtmlJson(req.body);
        context.log(JSON.stringify(req.body))
    }
    else {
        context.res = {
            status: 400,
            body: {
                "error": "no body"
            }
        };

        return context.done();
    }

    let username = null;

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
        let errMsg = req.body;
        let validInput = true;

        if (!(req.body.name && req.body.mail)) {
            context.res = {
                status: 400,
                body: "wrong input"
            };
            return context.done();
        }

        if (!nameVal(req.body.name)) {
            errMsg.name = "false";
            validInput = false;
        } if (!mailVal(req.body.mail)) {
            errMsg.mail = "false";
            validInput = false;
        } if (validInput) {

            connectRead(context, authorize);

        } else {
            context.res = {
                status: 400,
                body: errMsg
            }
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

                context.log("valid token");

                client.db(DBName).collection("employee").find({ "employeeId": decoded.preferred_username }).project({ "admin": 1 }).toArray((error, docs) => {

                    if (error) {
                        context.log("Error running query");
                        context.res = { status: 500, body: "Error running query" };
                        return context.done();

                    } else {

                        if (docs[0].admin === "write")
                            connectWrite(context, functionQuery);
                        else {
                            context.res = {
                                status: 401, body: {
                                    'name': "unauthorized, you need admin-write permission"
                                }
                            };
                            context.log("Accessed by ueser without admin permission");
                            return context.done();
                        }

                    }
                });



            }
        });
    };

    const query = {
        "name": req.body.name,
        "contact": {
            "phone": req.body.phone || "null",
            "mail": req.body.mail,
            "name": req.body.contactName || "null"
        },
        "suppliers": req.body.suppliers || [],
        "tags": req.body.tags || [],
        "comment": req.body.comment || "null",
        "types": [],
        "typeValues": [],
        "customerAgreements": [],
        "infoReference": req.body.infoReference || "null"
    };


    const functionQuery = (client) => {

        client.db(DBName).collection("customer").insertOne(query, (error, docs) => {
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