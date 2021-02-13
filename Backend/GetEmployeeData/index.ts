import { Context, HttpRequest } from "@azure/functions"

module.exports = async (context: Context, req: HttpRequest): Promise<void> => {
    const validator: any = require('../SharedFiles/inputValidation')

    let nameVal = req.body.name;



    if (!(req.body && nameVal && validator.name(nameVal))) {
        context.res = {
            status: 400,
            body: {
                error: "Wrong input"
            }
        }
        return;
    }

    const dbDep: any = require('../SharedFiles/dataBase');

    const query = {
        id: nameVal
    }

    const projection = {
        _id: 0,
        navn: 1,
        fdato: 1,
        kontaktInfo: 1
    }


    try {
        // Connect to db
        let client = await dbDep.clientRead();





        /*
        // Get customer data security pseudo code
        let val = await client.db(dbDep.DBName).collection("ansatte").find("navn på ansatt").toArray();

        if (val.customers.has(nameVal) && (val.customers.accessLevel == "read" || val.customers.accessLevel == "write")) {
            run code;
        } else {
            statusCode = 403;
            data = "No access to costumer";
        }


        */



        // QUery data from db
        let data = await client.db(dbDep.DBName).collection("ansatte").find(query).project(projection).toArray();

        let statusCode = 200;
        context.log("Employees found: " + data.length);

        if (data.length != 1) {
            statusCode = 400;

            if (data.length < 1)
                data = { error: "No employees found" };
            else
                data = { error: "More than one employee found" };
        }
        else
            data = data[0];

        //console.log(JSON.stringify(data.kontaktInfo.epost))
        context.res = {
            status: statusCode,
            body: data
        }

    } catch {
        context.log("Something went wrong");
        context.res = {
            status: 500,
            body: {
                error: "Could not connect to database"
            }
        }
    }
}