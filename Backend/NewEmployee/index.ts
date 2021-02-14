import { Context, HttpRequest } from "@azure/functions"

module.exports = (context: Context, req: HttpRequest): any => {
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

    const inputValidation = () => {
        let errMsg = req.body;
        let validInput = true;

        if (!(req.body && req.body.name && req.body.mail && req.body.number)) {
            context.res = {
                status: 400,
                body: "name, mail or number not given"
            }
            return context.done();
        }

        if (!validator.name(req.body.name)) {
            errMsg.name = 'false';
            validInput = false;
        } if (!validator.phone(req.body.number)) {
            errMsg.number = 'false';
            validInput = false;
        } if (!validator.mail(req.body.mail)) {
            errMsg.mail = 'false';
            validInput = false;
        } if (req.body.date && !validator.date(req.body.date)) {
            errMsg.date = 'false';
            validInput = false;
        } if (validInput) {

            connect()

        } else {
            context.res = {
                status: 400,
                body: errMsg
            }
            return context.done();
        }
    }

    // Connect to db
    const connect = () => {
        if (dbDep.clientWrite == null) {
            dbDep.MongoClient.connect(dbDep.uriWrite, (error, _client) => {
                if (error) {

                    context.log('Failed to connect');
                    context.res = { status: 500, body: 'Failed to connect' }
                    return context.done();
                }
                dbDep.clientWrite = _client;
                context.log('Connected');
                authorize(dbDep.clientWrite);
            })
        }
        else {
            authorize(dbDep.clientWrite);
        }
    }

    const authorize = (client) => {
        if (true) {
            // if valid credentials
            newEmployee(client)

        } else {
            context.log('Unauthorized');
            context.res = { status: 401, body: 'Unauthorized' }
            return context.done();
        }
    }

    const newEmployee = (client) => {
        client.db(dbDep.DBName).collection('ansatte').insertOne(query, (error, docs) => {
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