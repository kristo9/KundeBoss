import { Context, HttpRequest } from "@azure/functions"

module.exports = async (context: Context, req: HttpRequest): Promise<void> => {

    if (!(req.body && req.body.name && req.body.mail && req.body.number)) {
        context.res = {
            status: 400,
            body: "name, mail or number not given"
        }
        return;
    }

    const validator: any = require('../SharedFiles/inputValidation')
    let errMsg = req.body;
    let validArgs = true;

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

        try {
            // Connect to db
            let client = await dbDep.client();
            // Insert into db
            const result = await client.db(dbDep.DBName).collection('ansatte').insertOne(query);
            // Response to client
            context.res = {
                status: 200,
                body: {
                    _id: result.insertedId
                }
            }

            await client.close();

        } catch {
            context.log("Something went wrong");
            context.res = {
                status: 500,
                body: {
                    error: "Could not connect to database"
                }
            }
        }
    } else {
        context.res = {
            status: 400,
            body: errMsg
        }
        return;
    }
}