import { Context, HttpRequest } from '@azure/functions';
import { returnResult } from '../SharedFiles/dataValidation';
import { getKey, options, prepToken, errorQuery, errorUnauthorized } from '../SharedFiles/auth';
import { verify } from 'jsonwebtoken';
import { connectRead } from '../SharedFiles/dataBase';
import { Db, Decoded } from '../SharedFiles/interfaces';

/**
 * @description Function that returns all the employees
 * @param context - passed from the Azure function runtime, used to store information about/from the function
 * @return context.res.body that contains a JSON object that is an array of JSON objects for each employee
 */
export default (context: Context, req: HttpRequest): any => {
  let employeeId: any;

  let token = prepToken(context, req.headers.authorization);

  if (token === null) {
    errorUnauthorized(context, 'Token is null');
    return context.done();
  }

  /**
   * @description Function that checks if user has sufficient permission level. If sufficient, calls functionQuery, else finishes context
   * @param db read access to the database, needed to check permission level
   */
  const authorize = (db: Db) => {
    verify(token, getKey, options, (err: any, decoded: Decoded) => {
      // Verified and decoded token
      if (err) {
        errorUnauthorized(context, 'Token not valid');
        return context.done();
      } else {
        employeeId = decoded.preferred_username;

        db.collection('employee') // query to find users permission level
          .find({ 'employeeId': employeeId })
          .project({ 'admin': 1 })
          .toArray((error: any, docs: JSON | JSON[]) => {
            if (error) {
              errorQuery(context);
              return context.done();
            } else {
              if (docs[0].admin === 'write') {
                functionQuery(db);
              } else {
                errorUnauthorized(context, 'User dont have admin-write permission');
                return context.done();
              }
            }
          });
      }
    });
  };

  // What information is to be recieved
  const projection = {
    '_id': 0,
    'name': 1,
    'employeeId': 1,
    'admin': 1,
    'customers.id': 1,
    'customers.permission': 1,
  };

  /**
   * @description Query that asks for all employees in the database
   * @param db read access to database, needed to recieve all employees
   * @return context.res.body that contains a JSON object that is an array of JSON objects for each employee
   */
  const functionQuery = (db: Db) => {
    const project2 = {
      '_id': 0,
      'name': 1,
      'employeeId': 1,
      'admin': 1,
      'customers': 1,
      'customerInformation._id': 1,
      'customerInformation.name': 1,
    };

    db.collection('employee')
      .aggregate([
        /*         {
          '$match': {
            employeeId: employeeId,
          },
        }, */
        {
          '$lookup': {
            'from': 'customer',
            'localField': 'customers.id',
            'foreignField': '_id',
            'as': 'customerInformation',
          },
        },
        { '$project': project2 },
      ])
      .toArray((error: any, docs: JSON) => {
        if (error) {
          errorQuery(context);
          return context.done();
        }

        let stuff = null;
        let arrL = Object.keys(docs).length;

        for (let index = 0; index < arrL; index++) {
          stuff = docs[index].customers;
          docs[index].customerInformation.forEach((customerInformation) => {
            stuff.forEach((element) => {
              if (JSON.stringify(element.id).includes(customerInformation._id)) {
                customerInformation.permission = element.permission;
              }
            });
          });

          delete docs[index].customers;
        }

        returnResult(context, docs);
        context.done();
      });
  };
  connectRead(context, authorize);
};
