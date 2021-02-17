import { Context, HttpRequest } from "@azure/functions"

module.exports = (context: Context, req: HttpRequest): any => {
    const dbDep: any = require('../SharedFiles/dataBase');

    const query = {};

    const projection = {
        _id: 1,
        navn: 1
    };

    const inputValidation = () => {
        if (true) {

            connect();

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

    const connect = () => {
        if (dbDep.clientRead == null || !dbDep.clientRead.isConnected()) {
            dbDep.MongoClient.connect(dbDep.uriRead, dbDep.config, (error, _client) => {
                if (error) {

                    context.log('Failed to connect');
                    context.res = { status: 500, body: 'Failed to connect' };
                    return context.done();
                }
                dbDep.clientRead = _client;
                context.log('Connected');
                authorize(dbDep.clientRead);
            });
        }
        else {
            authorize(dbDep.clientRead);
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
    }

    const getAllEnployees = (client: any) => {
        client.db(dbDep.DBName).collection("ansatte").find(query).project(projection).toArray((error, docs) => {
            if (error) {
                context.log('Error running query');
                context.res = { status: 500, body: 'Error running query' };
                return context.done();
            }

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