import { Context, HttpRequest } from "@azure/functions"

module.exports = async (context: Context, req: HttpRequest): Promise<void> => {
    const dbDep: any = require('../SharedFiles/dataBase');

    const projection = {
        _id: 1,
        navn: 1
    }

    try {
        var start = new Date().getTime();
        // Connect to db
        let client = await dbDep.client();
        // QUery data from db
        let data = await client.db(dbDep.DBName).collection("ansatte").find().project(projection).toArray();

        var end = new Date().getTime();
        var time = end - start;
        context.log('DB connection and query time: ' + time + "ms");

        let statusCode = 200;

        context.log("Employees found: " + data.length);

        if (data.length < 1) {
            data = { error: "no entry found" };
            statusCode = 400;
        }

        //console.log(JSON.stringify(data.kontaktInfo.epost))
        context.res = {
            status: statusCode,
            body: data
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
}