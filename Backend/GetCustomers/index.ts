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

  /**
   * Query that asks for customers that a user has access to
   * @param db read access to database, needed to recieve customers
   * @return potential new tags and all the customers the user has access to
   */
  const functionQuery = (db: Db) => {
    db.collection(collections.employee).findOne(
      { 'employeeId': employeeId },
      { 'projection': { 'name': 1, 'employeeId': 1, 'customers': 1, 'admin': 1 } },
      (error: any, docs: any) => {
        if (error) {
          errorQuery(context);
          return context.done();
        }
        if (!docs) {
          errorUnauthorized(context);
          return context.done();
        }
        let employee = docs;
        let query = null;

        if (employee?.admin === 'write' || employee?.admin === 'read') {
          query = {};
        } else {
          query = { '_id': { '$in': employee?.customers.map((customer) => customer?.id) } };
        }
        delete employee?.customers;

        db.collection(collections.customer)
          .aggregate([
            {
              '$match': query,
            },
            /* Gets all suppliers linked to the customer */
            {
              '$lookup': {
                'from': 'mailGroup',
                'localField': 'mailGroup',
                'foreignField': '_id',
                'as': 'mailGroup',
              },
            },
            { '$unwind': '$mailGroup' },
            /* Gets all mails in customers mailGroup */
            {
              '$lookup': {
                'from': 'mail',
                'localField': 'mailGroup.mails',
                'foreignField': '_id',
                'as': 'mails',
              },
            },
            {
              '$project': { '_id': 1, 'name': 1, 'contact.name': 1, 'contact.mail': 1, 'tags': 1, 'mails.seenBy': 1 },
            },
          ])
          .toArray((error: any, docs: any) => {
            if (error) {
              errorQuery(context);
              return context.done();
            }

            let allTags = [];

            employee['customerInformation'] = docs;

            employee.customerInformation.forEach((customer) => {
              let changedMails = 0;
              customer.mails.forEach((mail) => {
                if (!mail?.seenBy?.includes(employeeId)) {
                  ++changedMails;
                }
              });
              customer['changedMails'] = changedMails;
              delete customer.mails;
              allTags = allTags.concat(customer.tags);
            });

            employee['allTags'] = allTags.filter((tag, index) => allTags.indexOf(tag) === index);
            delete employee.mails;

            returnResult(context, employee);

            context.done();
          });
      }
    );
  };

  connectRead(context, authorize);
};
