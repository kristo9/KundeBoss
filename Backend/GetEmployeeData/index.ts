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

    const getEmployeeData = () => {
        dbDep.clientRead.db(dbDep.DBName).collection("ansatte").find(query).project(projection).toArray((error, docs) => {
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

    const connectAndQuery = (callback) => {
        if (dbDep.clientRead == null) {
            dbDep.MongoClient.connect(dbDep.uriRead, (error, _client) => {
                if (error) {

                    context.log('Failed to connect');
                    context.res = { status: 500, body: 'Failed to connect' }
                    return context.done();
                }
                dbDep.clientRead = _client;
                context.log('Connected');
                callback();

            })
        }
        else {
            callback();
        }
    }

    if (req.body && name && validator.name(name)) {
        connectAndQuery(getEmployeeData);
    } else {
        context.res = {
            status: 400,
            body: {
                error: "Wrong input"
            }
        }
        context.done();
        return;
    }
}