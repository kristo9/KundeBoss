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
  const getCustomerIds = (db) => {
    return new Promise((resolve, reject) => {
      db.collection(collections.customer)
        .find({}, { projection: { _id: 1 } })
        .toArray((error, docs) => {
          if (error) {
            reject(null);
          } else {
            resolve(docs);
          }
        });
    });
  };

  let isCustomer = true;
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
        let customerIds = getCustomerIds(db);

        db.collection('employee').findOne(
          {
            'employeeId': decoded.preferred_username,
          },
          {
            'customers': 1,
          },
          async (error: any, docs) => {
            if (error) {
              errorQuery(context);
              return context.done();
            } else {
              if (!JSON.stringify(await customerIds).includes(req.body.id)) {
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
    db.collection('customer')
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
        /* Gets mailGroup linked to the customer */
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
          '$project': { 'mailGroup': 0 },
        },
      ])
      .toArray((error: any, docs: any) => {
        if (error) {
          errorQuery(context);
          return context.done();
        }
        //console.log(docs);
        if (docs.length === 0) {
          errorWrongInput(context, 'No customer found');
          return context.done();
        }

        docs = docs[0];

        docs.mails.reverse();

        docs.supplierInformation.forEach((supplierInformation, index) => {
          if (JSON.stringify(docs.suppliers).includes(supplierInformation._id)) {
            docs.suppliers[index].name = supplierInformation.name;
          }
        });

        if (isCustomer !== false) {
          delete docs.mails;
        }
        delete docs.supplierInformation;
        returnResult(context, docs);
        context.done();
      });
  };

  inputValidation();
};
