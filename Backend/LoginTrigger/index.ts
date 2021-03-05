import { Context, HttpRequest } from '@azure/functions';
import { returnResult } from '../SharedFiles/dataValidation';
import { getKey, options, prepToken, errorQuery, errorUnauthorized } from '../SharedFiles/auth';
import { connectRead, connectWrite } from '../SharedFiles/dataBase';
import { verify } from 'jsonwebtoken';
import { Db, Decoded } from '../SharedFiles/interfaces';

module.exports = (context: Context, req: HttpRequest): any => {
  let decodedToken = null;

  let token = prepToken(context, req.headers.authorization);

  if (token === null) {
    return context.done();
  }

  const authorize = (db: Db) => {
    verify(token, getKey, options, (err: any, decoded: Decoded) => {
      // verified and decoded token
      if (err) {
        errorUnauthorized(context, 'Token not valid');
        return context.done();
      } else {
        decodedToken = decoded;
        functionQuery(db);
      }
    });
  };

  let result: JSON = JSON.parse('{}');
  result['firstLogin'] = false;
  result['isConfigured'] = false;

  const functionQuery = (db: Db) => {
    result['name'] = decodedToken.name;

    db.collection('employee')
      .find()
      .project({
        '_id': 0,
        'employeeId': 1,
        'isCustomer': 1
      })
      .toArray((error: any, docs: string | any[]) => {
        if (error) {
          errorQuery(context);
          return context.done();
        } else {
          if (docs.length === 0) {
            connectWrite(context, firstEmployee);
          } else {
            let element = null;

            for (let i = 0; i < docs.length; ++i) {
              if (docs[i].employeeId === decodedToken.preferred_username) {
                element = docs[i];
                break;
              }
            }

            if (element === null) {
              connectWrite(context, createEmplyee);
            } else {
              if (element.isCustomer !== null) {
                result['isConfigured'] = true;
              }

              returnResult(context, result);
              context.done();
            }
          }
        }
      });
  };

  let query = JSON.parse('{}');
  query['name'] = null;
  query['employeeId'] = null;
  query['customers'] = [];
  query['admin'] = null;
  query['isCustomer'] = null;

  const firstEmployee = (db: Db) => {
    context.log('Creating first employee with admin:write');
    query['admin'] = 'write';
    query['isCustomer'] = false;
    createEmplyee(db);
  };

  const createEmplyee = (db: Db) => {
    query['name'] = decodedToken.name;
    query['employeeId'] = decodedToken.preferred_username;

    db.collection('employee').insertOne(query, (error: any) => {
      if (error) {
        errorQuery(context);
        return context.done();
      }
      context.log('New employee created');

      result['firstLogin'] = true;

      returnResult(context, result);
      context.done();
    });
  };

  connectRead(context, authorize);
};
