import { Context, HttpRequest } from "@azure/functions"

module.exports = (context: Context, req: HttpRequest): Promise<void> => {
    const validator: any = require('../SharedFiles/inputValidation')
    const dbDep: any = require('../SharedFiles/dataBase');

    const query = {
        id: req.body.name,
        kontaktInfo:
        {
            mail: req.body.mail,
            tlf: req.body.number
        },
        navn: req.body.name,
        fdato: (req.body.date || "null"),       // Not required;
        dato: Date()
    }

    const newEmployee = () => {
        dbDep.clientWrite.db(dbDep.DBName).collection('ansatte').insertOne(query, (error, docs) => {
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

    // Connect to db
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

    let errMsg = req.body;
    let validArgs = true;

    if (!(req.body && req.body.name && req.body.mail && req.body.number)) {
        context.res = {
            status: 400,
            body: "name, mail or number not given"
        }
        context.done();
        return;
    }

    if (!validator.name(req.body.name)) {
        errMsg.name = 'false';
        validArgs = false;
    } if (!validator.phone(req.body.number)) {
        errMsg.number = 'false';
        validArgs = false;
    } if (!validator.mail(req.body.mail)) {
        errMsg.mail = 'false';
        validArgs = false;
    } if (req.body.date && !validator.date(req.body.date)) {
        errMsg.date = 'false';
        validArgs = false;
    } if (validArgs) {

        connectAndQuery(newEmployee);

    } else {
        context.res = {
            status: 400,
            body: errMsg
        }
        context.done();
    }
}