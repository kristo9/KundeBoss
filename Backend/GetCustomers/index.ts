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
                employeeId = decoded.preferred_username;
                console.log(employeeId);
                context.log("valid token");
                functionQuery(client);
            }
        });
    };

    // TODO: Query to run on database
    const query = {
        "employeeId": employeeId

    };

    // TODO: Projection,  Only for retrieving data
    const projection = {
        "name": 1,
        "employeeId": 1,
        "customerInformation._id": 1,
        "customerInformation.name": 1,
        "customerInformation.contact.name": 1,
        "customerInformation.contact.mail": 1,
        "customerInformation.tags": 1
    };


    const functionQuery = (client) => {

        client.db(DBName).collection("employee").aggregate([
            {
                $lookup:
                {
                    from: 'customer',
                    localField: 'customers',
                    foreignField: '_id',
                    as: 'customerInformation'
                }
            }
        ]).project(projection).toArray((error, docs) => {
            if (error) {
                context.log('Error running query');
                context.res = { status: 500, body: 'Error running query' }
                return context.done();
            }

            let emp;
            docs.forEach(element => {
                if (element.employeeId == employeeId) {
                    emp = element;
                }
            });

            emp = sanitizeHtmlJson(emp);

            context.log('Success!');
            context.res = {
                headers: { 'Content-Type': 'application/json' },
                body: emp
            };
            context.done();
        });
    };

    connectRead(context, authorize);
};