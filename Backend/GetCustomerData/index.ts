import { Context, HttpRequest } from '@azure/functions';
import { prepInput, returnResult, errorWrongInput, _idVal } from '../SharedFiles/dataValidation';
import { getKey, options, prepToken, errorQuery, errorUnauthorized } from '../SharedFiles/auth';
import { verify } from 'jsonwebtoken';
import { collections, connectRead } from '../SharedFiles/dataBase';
import { Db, Decoded } from '../SharedFiles/interfaces';
import { ObjectId } from 'mongodb';

/**
 * @description Get alle data about a customer
 * @param contect : Context
 * @param req : HttpRequest
 */
export default (context: Context, req: HttpRequest): any => {
  /* Sanitizes input. Returns if there are no request body */
  req.body = prepInput(context, req.body);
  if (req.body === null) {
    return context.done();
  }

  /* Checks that header includes a token. Returns if there are no token */
  let token = prepToken(context, req.headers.authorization);
  if (token === null) {
    return context.done();
  }

  let isCustomer = true;
  let username = null;

  /**
   * @description Validates that id provided in req.body has right format. Returns if it isn't
   * @returns contect.done()
   */
  const inputValidation = () => {
    if (_idVal(req.body?.id)) {
      connectRead(context, authorize);
    } else {
      errorWrongInput(context, 'id recieved not valid format');
      return context.done();
    }
  };

  /**
   * @description Finds all customer ids in the database
   * @returns promise that resolves to array of customer ids
   */
  const customerIdExist = (db) => {
    return new Promise((resolve) => {
      db.collection(collections.customer).findOne(
        { _id: ObjectId(req.body.id) },
        { 'projection': { '_id': 1 } },
        (error, docs) => {
          if (error) {
            errorQuery(context);
            resolve(false);
          } else {
            if (docs != null) {
              resolve(true);
            } else {
              errorWrongInput(context, 'No customer found');
              resolve(false);
            }
          }
        }
      );
    });
  };

  /**
   * @description validates token and that client has permission to get data about the customer
   * @param db : db connection
   */
  const authorize = (db: Db) => {
    verify(token, getKey, options, (err: any, decoded: Decoded) => {
      if (err) {
        errorUnauthorized(context, 'Token not valid');
        return context.done();
      } else {
        /*Check that customerid exists*/
        let customerIds = customerIdExist(db);
        username = decoded.preferred_username;

        db.collection(collections.employee).findOne(
          {
            'employeeId': username,
          },
          {
            'customers': 1,
          },
          async (error: any, docs) => {
            if (error) {
              errorQuery(context);
              return context.done();
            } else {
              if (!docs) {
                errorUnauthorized(context);
                return context.done();
              }
              if (!(await customerIds)) {
                errorWrongInput(context, 'No customer found');
                return context.done();
              }
              let cust = docs.customers.find(
                (customer) =>
                  customer.id == req.body.id && (customer.permission === 'read' || customer.permission === 'write')
              );
              /* Query database if user is admin or has access to the customer */
              if (docs.admin === 'write' || docs.admin === 'read' || cust) {
                if (docs.isCustomer === false) {
                  isCustomer = false;
                }

                functionQuery(db);
                return;
              }

              errorUnauthorized(context, 'User dont have permission to see customer');
              return context.done();
            }
          }
        );
      }
    });
  };

  /**
   * @description query db for all inforamtion about the specified customer
   * @param db : db connection
   */
  const functionQuery = (db: Db) => {
    db.collection(collections.customer)
      .aggregate([
        {
          '$match': {
            '_id': ObjectId(req.body.id),
          },
        },
        /* Gets all suppliers linked to the customer */
        {
          '$lookup': {
            'from': 'supplier',
            'localField': 'suppliers.id',
            'foreignField': '_id',
            'as': 'supplierInformation',
          },
        },
        /* Gets all mails in customers mailGroup */
        {
          '$lookup': {
            'from': collections.mail,
            'localField': 'mails',
            'foreignField': '_id',
            'as': 'mails',
          },
        },
      ])
      .toArray((error: any, docs: any) => {
        if (error) {
          errorQuery(context);
          return context.done();
        }
        if (docs.length === 0) {
          errorWrongInput(context, 'No customer found');
          return context.done();
        }
        docs = docs[0];

        if (isCustomer !== false) {
          delete docs.mails;
        } else {
          docs?.mails.reverse();
          docs?.mails.forEach((mail) => {
            if (mail?.seenBy?.includes(username)) {
              mail['newContent'] = false;
            } else {
              mail['newContent'] = true;
            }
          });
        }
        docs.supplierInformation.forEach((supplierInformation, index) => {
          if (JSON.stringify(docs.suppliers).includes(supplierInformation._id)) {
            docs.suppliers[index].name = supplierInformation.name;
          }
        });

        delete docs.supplierInformation;
        returnResult(context, docs);
        context.done();
      });
  };

  inputValidation();
};
