import { Context, HttpRequest } from '@azure/functions';
import { returnResult, prepInput, errorWrongInput } from '../SharedFiles/dataValidation';
import { getKey, options, prepToken, errorQuery, errorUnauthorized } from '../SharedFiles/auth';
import { verify } from 'jsonwebtoken';
import { connectRead } from '../SharedFiles/dataBase';
import { Db, Decoded } from '../SharedFiles/interfaces';

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
    let errMsg = req.body;
    let validInput = true;

    if (!req.body.types) {
      errorWrongInput(context);
      return context.done();
    }
    //console.log(req.body.types);
    console.log(req.body.types);

    if (validInput) {
      connectRead(context, authorize);
    } else {
      context.res = {
        status: 400,
        body: errMsg
      };
      return context.done();
    }
  };

  const authorize = (db: Db) => {
    verify(token, getKey, options, (err: any, decoded: Decoded) => {
      // verified and decoded token
      if (err) {
        errorUnauthorized(context, 'Msg');
        return context.done();
      } else {
        db.collection('employee')
          .find({
            employeeId: decoded.preferred_username
          })
          .project({
            admin: 1
          })
          .toArray((error: any, docs: JSON) => {
            if (error) {
              errorQuery(context);
              return context.done();
            } else {
              if (docs[0].admin === 'write') {
              } else {
                errorUnauthorized(context, 'Msg');

                return context.done();
              }
            }
          });
      }
    });
  };

  const query = {};

  const functionQuery = (db: Db) => {
    db.collection('customer').insertOne(query, (error: any, docs: JSON) => {
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
