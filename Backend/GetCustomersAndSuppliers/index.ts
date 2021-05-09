import { Context, HttpRequest } from '@azure/functions';
import { returnResult } from '../SharedFiles/dataValidation';
import { getKey, options, prepToken, errorQuery, errorUnauthorized } from '../SharedFiles/auth';
import { verify } from 'jsonwebtoken';
import { checkDbConnection, clientRead, collections, connectRead } from '../SharedFiles/dataBase';
import { Db, Decoded } from '../SharedFiles/interfaces';

/**
 * Function that returns all customers the user has access to
 * @param context - passed from the Azure function runtime, used to store information about/from the function
 * @param req - the httpRequest, in this case contains the authentification token
 * @return context.res.body that contains a JSON object that is an array of JSON objects for each customer
 */
export default (context: Context, req: HttpRequest): any => {
  checkDbConnection(context, clientRead);

  let employeeId: any;

  let token = prepToken(context, req.headers.authorization);

  if (token === null) {
    errorUnauthorized(context, 'Token is null');
    return context.done();
  }

  let userIsAdmin = false;

  const authorize = (db: Db) => {
    verify(token, getKey, options, (err: any, decoded: Decoded) => {
      // verified and decoded token
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
              if (docs[0]?.admin === 'write' || docs[0]?.admin === 'read') {
                userIsAdmin = true;
              }
              functionQuery(db);
            }
          });
      }
    });
  };

  /**
   * Query that asks for customers that a user has access to
   * @param db read access to database, needed to recieve customers
   * @return potential new tags and all the customers the user has access to
   */
  const functionQuery = (db: Db) => {
    let aggregate = null;
    let collection = null;
    if (userIsAdmin) {
      collection = collections.customer;
      aggregate = [
        {
          '$lookup': {
            'from': 'supplier',
            'localField': 'suppliers.id',
            'foreignField': '_id',
            'as': 'suppliers',
          },
        },
        {
          '$project': {
            'name': 1,
            'suppliers._id': 1,
            'suppliers.name': 1,
          },
        },
      ];
    } else {
      collection = collections.employee;
      aggregate = [
        {
          '$match': {
            'employeeId': employeeId,
          },
        },
        {
          '$lookup': {
            'from': 'customer',
            'localField': 'customers.id',
            'foreignField': '_id',
            'as': 'customers',
          },
        },
        { '$unwind': '$customers' },
        {
          '$lookup': {
            'from': 'supplier',
            'localField': 'customers.suppliers.id',
            'foreignField': '_id',
            'as': 'customers.suppliers',
          },
        },
        {
          '$project': {
            'customers._id': 1,
            'customers.name': 1,
            'customers.suppliers.name': 1,
            'customers.suppliers._id': 1,
          },
        },
      ];
    }

    db.collection(collection) // Query to recieve information about one employee and his customers
      .aggregate(aggregate)
      .toArray((error: any, docs: JSON[]) => {
        if (error) {
          errorQuery(context);
          return context.done();
        } else {
          //docs = JSON.parse(JSON.stringify(docs).replace(/"customers":/g, '"customer":'));
          let customers: any = [];
          docs.forEach((customer) => {
            if (userIsAdmin) {
              customers.push({'customer':customer});
            } else {
              customer = JSON.parse(JSON.stringify(customer).replace('"customers":', '"customer":'));
              customers.push(customer);
              delete customer['_id'];
            }
            console.log(JSON.stringify(customer,null,2))
          });
          
          returnResult(context, customers);
          context.done();
        }
      });
  };

  connectRead(context, authorize);
};
