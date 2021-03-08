import { Context, HttpRequest } from '@azure/functions';
import { prepInput, returnResult, errorWrongInput, _idVal } from '../SharedFiles/dataValidation';
import { getKey, options, prepToken, errorQuery, errorUnauthorized } from '../SharedFiles/auth';
import { verify } from 'jsonwebtoken';
import { connectRead } from '../SharedFiles/dataBase';
import { Db, Decoded } from '../SharedFiles/interfaces';
import { ObjectId } from 'mongodb';

module.exports = (context: Context, req: HttpRequest): any => {
  req.body = prepInput(context, req.body);

  if (req.body === null) {
    return context.done();
  }

  let token = prepToken(context, req.headers.authorization);

  if (token === null) {
    return context.done();
  }

  const inputValidation = () => {
    if (_idVal(req.body.id)) {
      connectRead(context, authorize);
    } else {
      errorWrongInput(context, 'id recieved not valid format');
      return context.done();
    }
  };

  const authorize = (db: Db) => {
    verify(token, getKey, options, (err: any, decoded: Decoded) => {
      if (err) {
        errorUnauthorized(context, 'Token not valid');
        return context.done();
      } else {
        db.collection('employee').findOne(
          {
            'employeeId': decoded.preferred_username
          },
          {
            'customers': 1
          },
          (error: any, docs) => {
            if (error) {
              errorQuery(context);
              return context.done();
            } else {
              console.log(docs);
              if (docs.admin === 'write' || docs.admin === 'read') {
                connectRead(context, functionQuery);
                return;
              }

              for (let i = 0; i < docs.customers.length; ++i) {
                if (
                  docs.customers[i].id === req.body.id &&
                  (docs.customers[i].permission === 'read ' || docs.customers[i].permission === 'write ')
                ) {
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

  const query = {
    '_id': ObjectId(req.body.id)
  };

  console.log('query');
  console.log(query);

  const projection = {};

  const functionQuery = (db: Db) => {
    db.collection('customer').findOne(query, projection, (error: any, docs: JSON) => {
      if (error) {
        errorQuery(context);
        return context.done();
      }
      console.log(docs);
      returnResult(context, docs);
      context.done();
    });
  };

  inputValidation();
};
