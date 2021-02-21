import { Context, HttpRequest } from "@azure/functions"

const validator: any = require('../SharedFiles/inputValidation');
const dbDep: any = require('../SharedFiles/dataBase');

export default (context: Context, req: HttpRequest): any => {

    req.body = validator.sanitizeHtmlJson(req.body);

    let name = req.body.name;

    const query = {
        id: name
    };

    const projection = {
        '_id': 0,
        'navn': 1,
        'fdato': 1,
        'kontaktInfo.tlf': 1
    };

    const inputValidation = () => {
        if (req.body && name && validator.name(name)) {

            dbDep.connectRead(context, authorize);

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
            context.log('Unauthorized');
            context.res = { status: 401, body: 'Unauthorized' }
            return context.done();
        }
    };

    const getEmployeeData = (client) => {
        client.db(dbDep.DBName).collection("ansatte").find(query).project(projection).toArray((error, docs) => {
            if (error) {
                context.log('Error running query');
                context.res = { status: 500, body: 'Error running query' };
                return context.done();
            }

            docs = validator.sanitizeHtmlJson(docs);

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