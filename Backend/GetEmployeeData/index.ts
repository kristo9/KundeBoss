import { Context, HttpRequest } from "@azure/functions"

module.exports = (context: Context, req: HttpRequest): any => {
    const validator: any = require('../SharedFiles/inputValidation');
    const dbDep: any = require('../SharedFiles/dataBase');

    let name = req.body.name;

    const query = {
        id: name
    }

    const projection = {
        _id: 0,
        navn: 1,
        fdato: 1,
        kontaktInfo: 1
    }

    const inputValidation = () => {
        if (req.body && name && validator.name(name)) {

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
    }

    const connect = () => {
        if (dbDep.clientRead == null) {
            dbDep.MongoClient.connect(dbDep.uriRead, (error, _client) => {
                if (error) {

                    context.log('Failed to connect');
                    context.res = { status: 500, body: 'Failed to connect' }
                    return context.done();
                }
                dbDep.clientRead = _client;
                context.log('Connected');
                authorize(dbDep.clientRead);
            })
        }
        else {
            authorize(dbDep.clientRead);
        }
    }

    const authorize = (client) => {
        if (true) {
            // if valid credentials
            getEmployeeData(client)

        } else {
            context.log('Unauthorized');
            context.res = { status: 401, body: 'Unauthorized' }
            return context.done();
        }
    }

    const getEmployeeData = (client) => {
        client.db(dbDep.DBName).collection("ansatte").find(query).project(projection).toArray((error, docs) => {
            if (error) {
                context.log('Error running query');
                context.res = { status: 500, body: 'Error running query' }
                return context.done();
            }

            context.log('Success!');
            context.res = {
                headers: { 'Content-Type': 'application/json' },
                body: docs
            };
            context.done();
        });
    }

    inputValidation();
}