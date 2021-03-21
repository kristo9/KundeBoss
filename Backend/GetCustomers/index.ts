import { Context, HttpRequest } from '@azure/functions';
import { returnResult } from '../SharedFiles/dataValidation';
import { getKey, options, prepToken, errorQuery, errorUnauthorized } from '../SharedFiles/auth';
import { verify } from 'jsonwebtoken';
import { checkDbConnection, clientRead, connectRead } from '../SharedFiles/dataBase';
import { Db, Decoded } from '../SharedFiles/interfaces';

/**
 * Function that returns all customers the user has access to
 * @param context - passed from the Azure function runtime, used to store information about/from the function
 * @param req - the httpRequest, in this case contains the authentification token
 * @return context.res.body that contains a JSON object that is an array of JSON objects for each customer
 */
module.exports = (context: Context, req: HttpRequest): any => {
  checkDbConnection(context, clientRead);

  let employeeId: any;

  let token = prepToken(context, req.headers.authorization);

  if (token === null) {
    errorUnauthorized(context, 'Token is null');
    return context.done();
  }

  const authorize = (db: Db) => {
    verify(token, getKey, options, (err: any, decoded: Decoded) => {
      // verified and decoded token
      if (err) {
        errorUnauthorized(context, 'Token not valid');
        return context.done();
      } else {
        employeeId = decoded.preferred_username;
        functionQuery(db);
      }
    });
  };

  // Which information is to be recieved
  const projection = {
    'name': 1,
    'employeeId': 1,
    'customerInformation._id': 1,
    'customerInformation.name': 1,
    'customerInformation.contact.name': 1,
    'customerInformation.contact.mail': 1,
    'customerInformation.tags': 1,
  };

  /**
   * Query that asks for customers that a user has access to
   * @param db read access to database, needed to recieve customers
   * @return potential new tags and all the customers the user has access to
   */
  const functionQuery = (db: Db) => {
    db.collection('employee') // Query to recieve information about one employee and his customers
      .aggregate([
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
            'as': 'customerInformation',
          },
        },
        { '$project': projection },
      ])
      .toArray((error: any, docs: JSON) => {
        if (error) {
          errorQuery(context);
          return context.done();
        } else {
          let result = docs[0];
          let customers = result.customerInformation;
          let allTags = [];

          /* 
          // Adds tags if they are not already added
           for (let i = 0; i < customers.length; ++i) {
            for (let j = 0; j < customers[i].tags.length; ++j) {
              if (!allTags.includes(customers[i].tags[j])) {
                allTags.push(customers[i].tags[j]);
                }
              }
           }
          result['allTags'] = allTags; */

          customers.forEach((customer) => (allTags = allTags.concat(customer.tags)));

          result['allTags'] = allTags.filter((tag, index) => allTags.indexOf(tag) === index);

          if (req.body && req.body.tag) {
            // Search for custoemrs that matches tag search
            result.customerInformation = customers.filter((customer) =>
              customer.tags.map((tag) => tag.toLowerCase().includes(req.body.tag.toLowerCase())).includes(true)
            );
          }

          returnResult(context, result);
          context.done();
        }
      });
  };

  connectRead(context, authorize);
};
