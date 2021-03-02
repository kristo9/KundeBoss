import { Context, HttpRequest } from '@azure/functions';
import { prepInput, nameVal, returnResult, errorWrongInput } from '../SharedFiles/dataValidation';
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

    if (!req.body.name) {
      errorWrongInput(context);
      return context.done();
    }
    if (!nameVal(req.body.name)) {
      errMsg.name = 'false';
      validInput = false;
    }
    if (validInput) {
      connectRead(context, authorize);
    } else {
      console.log('error');
      errorWrongInput(context);
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
        db.collection('employee')
          .find({ employeeId: decoded.preferred_username })
          .project({ admin: 1 })
          .toArray((error: any, docs: { admin: string }[]) => {
            if (error) {
              errorQuery(context);
              return context.done();
            } else {
              if (docs[0].admin === 'write') {
                functionQuery(db);
              } else {
                errorUnauthorized(context, 'User dont have admin permission');
                console.log(docs[0].admin);
                return context.done();
              }
            }
          });
      }
    });
  };

  const query = {
    'name': req.body.name,
  };

  const projection = {
    '_id': 0,
    'name': 1,
    'employeeId': 1,
    'admin': 1,
    'customers': 1,
    'customer': 1,
  };

  const functionQuery = (db: Db) => {
    db.collection('employee')
      .find(query)
      .toArray((error: any, docs: JSON) => {
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
