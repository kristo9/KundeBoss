import { Context, HttpRequest } from '@azure/functions';
import { prepInput, returnResult, errorWrongInput, _idVal } from '../SharedFiles/dataValidation';
import { getKey, options, prepToken, errorQuery, errorUnauthorized } from '../SharedFiles/auth';
import { verify } from 'jsonwebtoken';
import { connectRead } from '../SharedFiles/dataBase';
import { Db, Decoded } from '../SharedFiles/interfaces';
import { ObjectId } from 'mongodb';

export = (context: Context, req: HttpRequest): any => {
  req.body = prepInput(context, req.body);

  if (req.body === null) {
    return context.done();
  }

  let token = prepToken(context, req.headers.authorization);

  if (token === null) {
    return context.done();
  }

  const inputValidation = () => {
    if (_idVal(req.body?.id)) {
      connectRead(context, authorize);
    } else {
      errorWrongInput(context, 'id recieved not valid format');
      return context.done();
    }
  };

  let isCustomer = true;

  const authorize = (db: Db) => {
    verify(token, getKey, options, (err: any, decoded: Decoded) => {
      if (err) {
        errorUnauthorized(context, 'Token not valid');
        return context.done();
      } else {
        db.collection('employee').findOne(
          {
            'employeeId': decoded.preferred_username,
          },
          {
            'customers': 1,
          },
          (error: any, docs) => {
            if (error) {
              errorQuery(context);
              return context.done();
            } else {
              if (docs.admin === 'write' || docs.admin === 'read') {
                isCustomer = false;
                functionQuery(db);
                return;
              }

              for (let i = 0; i < docs.customers.length; ++i) {
                if (
                  docs.customers[i].id == req.body.id &&
                  (docs.customers[i].permission === 'read' || docs.customers[i].permission === 'write')
                ) {
                  console.log(docs.isCustomer);
                  if (docs.isCustomer === false) {
                    isCustomer = false;
                  }
                  connectRead(context, functionQuery);
                  return;
                }
              }

              errorUnauthorized(context, 'User dont have admin permission');
              return context.done();
            }
          }
        );
      }
    });
  };

  const functionQuery = (db: Db) => {
    db.collection('customer') // Query to recieve information about one customer and their suppliers
      .aggregate([
        {
          '$match': {
            '_id': ObjectId(req.body.id),
          },
        },
        {
          '$lookup': {
            'from': 'supplier',
            'localField': 'suppliers.id',
            'foreignField': '_id',
            'as': 'supplierInformation',
          },
        },
        {
          '$lookup': {
            'from': 'mailGroup',
            'localField': 'mailGroup',
            'foreignField': '_id',
            'as': 'mailGroup',
          },
        },
        { '$unwind': '$mailGroup' },
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
        docs = docs[0];
        for (let i = 0; i < docs.suppliers.length; ++i) {
          for (let j = 0; j < docs.supplierInformation.length; ++j) {
            if (JSON.stringify(docs.suppliers[i].id) === JSON.stringify(docs.supplierInformation[j]._id)) {
              docs.suppliers[i].name = docs.supplierInformation[j].name;
              break;
            }
          }
        }
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
