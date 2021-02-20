import { Context, HttpRequest } from "@azure/functions"

const dbDep: any = require('../SharedFiles/dataBase');
const validator = require('../SharedFiles/inputValidation');

module.exports = (context: Context, req: HttpRequest): any => {

    const query = {};

    const projection = {
        _id: 1,
        navn: 1
    };

    const inputValidation = () => {
        if (true) {

            dbDep.connectRead(context, authorize);

        } else {
            context.res = {
                status: 400,
                body: {
                    error: "Wrong input"
                }
            }
            return context.done();
        }
    };

    const authorize = (client: any) => {
        if (true) {
            // if valid credentials
            getAllEnployees(client);

        } else {
            context.log('Unauthorized');
            context.res = { status: 401, body: 'Unauthorized' };
            return context.done();
        }
    };

    const getAllEnployees = (client: any) => {
        client.db(dbDep.DBName).collection("ansatte").find(query).project(projection).toArray((error: any, docs: any) => {
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