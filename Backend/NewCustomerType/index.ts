import { Context, HttpRequest } from '@azure/functions';
import { prepInput, nameVal, mailVal, returnResult, errorWrongInput } from '../SharedFiles/dataValidation';
import { getKey, options, prepToken, errorQuery, errorUnauthorized } from '../SharedFiles/auth';
import { verify } from 'jsonwebtoken';
import { collections, connectRead, connectWrite } from '../SharedFiles/dataBase';
import { Db, Decoded } from '../SharedFiles/interfaces';
import { ObjectId } from 'mongodb';

module.exports = (context: Context, req: HttpRequest): any => {
  req.body = prepInput(context, req.body);

  if (req.body === null) return context.done();

  let token = prepToken(context, req.headers.authorization);

  if (token === null) return context.done();

  const inputValidation = () => {
    let errMsg = 'Error: ';
    let validInput = true;

    if (validInput) {
      connectRead(context, authorize);
    } else {
      errorWrongInput(context, errMsg);
      return context.done();
    }
  };

  const authorize = (db: Db) => {
    verify(token, getKey, options, (err: any, decoded: Decoded) => {
      // verified and decoded token
      if (err) {
        errorUnauthorized(context, 'Token not valid');
        return context.done();
      } else {
        db.collection('employee').findOne(
          {
            'employeeId': decoded.preferred_username,
          },
          {
            'admin': 1,
          },
          (error: any, docs: { admin: string }) => {
            if (error) {
              errorQuery(context);
              return context.done();
            } else {
              if (docs.admin === 'write') {
                connectWrite(context, functionQuery);
              } else {
                errorUnauthorized(context, 'User dont have admin permission');
                return context.done();
              }
            }
          }
        );
      }
    });
  };

  const query = {
    'name': req.body.name,
  };
  const update = {
    '$set': {
      'name': req.body.name,
      'values': req.body.values || [],
    },
  };
  const queryOptions = {
    upsert: true,
  };

  const functionQuery = (db: Db) => {
    db.collection(collections.customerType).updateOne(query, update, queryOptions, (error: any, docs: JSON) => {
      if (error) {
        errorQuery(context);
        return context.done();
      }
      returnResult(context, docs);
      context.done();
    });
  };

  inputValidation();
};
