import { Context, HttpRequest } from "@azure/functions"

module.exports = (context: Context, req: HttpRequest): any => {
    const dbDep: any = require('../SharedFiles/dataBase');

    const query = {}

    const projection = {
        _id: 1,
        navn: 1
    }

    const getAllEnployees = () => {
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

    connectAndQuery(getAllEnployees);
}