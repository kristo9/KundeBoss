import { Context, HttpRequest } from '@azure/functions';
import { prepInput, nameVal, mailVal, returnResult, errorWrongInput } from '../SharedFiles/dataValidation';
import { getKey, options, prepToken, errorQuery, errorUnauthorized } from '../SharedFiles/auth';
import { verify } from 'jsonwebtoken';
import { DBName, connectRead, connectWrite } from '../SharedFiles/dataBase';

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
      errorWrongInput(context);
      return context.done();
    }
  };

  const authorize = (client: { db: (arg0: string) => any }) => {
    verify(token, getKey, options, (err: any, decoded: { [x: string]: any }) => {
      // verified and decoded token
      if (err) {
        errorUnauthorized(context, 'Token not valid');
        return context.done();
      } else {
        client
          .db(DBName)
          .collection('employee')
          .find({ employeeId: decoded.preferred_username })
          .project({ admin: 1 })
          .toArray((error: any, docs: { admin: string }[]) => {
            if (error) {
              errorQuery(context);
              return context.done();
            } else {
              if (docs[0].admin === 'write') {
                connectWrite(context, functionQuery);
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

  const functionQuery = (client: { db: (arg0: string) => any }) => {
    const query = { 'name': req.body.origName };
    console.log('0');

    let newVals = JSON.parse('{}');

    if (req.body.name) {
      newVals['name'] = req.body.name;
    }
    if (req.body.employeeId) {
      newVals['employeeId'] = req.body.employeeId;
    }
    if (req.body.customers) {
      newVals['customers'] = req.body.customers;
    }
    if (req.body.admin) {
      newVals['admin'] = req.body.admin;
    }
    if (req.body.customer) {
      newVals['customer'] = req.body.customer;
    }

    newVals = { $set: newVals };

    client
      .db(DBName)
      .collection('employee')
      .updateOne(query, newVals, (error: any, docs: JSON) => {
        if (error) {
          console.log(error);
          errorQuery(context);
          return context.done();
        }

        returnResult(context, docs);
        context.done();
      });
  };

  inputValidation();
};
