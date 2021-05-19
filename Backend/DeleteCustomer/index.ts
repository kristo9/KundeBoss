import { Context, HttpRequest } from '@azure/functions';
import { prepInput, returnResult, errorWrongInput, _idVal } from '../SharedFiles/dataValidation';
import { getKey, options, prepToken, errorQuery, errorUnauthorized } from '../SharedFiles/auth';
import { verify } from 'jsonwebtoken';
import { collections, connectRead, connectWrite } from '../SharedFiles/dataBase';
import { Db, Decoded } from '../SharedFiles/interfaces';
import { ObjectId } from 'mongodb';

/**
 * @description Deletes a customer, their mailgroup and mails.
 * @param contect : Context
 * @param req : HttpRequest
 */
export default (context: Context, req: HttpRequest): any => {
  req.body = prepInput(context, req.body);

  if (req.body === null) {
    return context.done();
  }

  let token = prepToken(context, req.headers.authorization);

  if (token === null) {
    return context.done();
  }

  const inputValidation = () => {
    let errMsg = 'Error: ';
    let validInput = true;

    if (!_idVal(req.body?.id)) {
      errMsg += 'Not valid customer ID.';
      validInput = false;
    }
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
        db.collection(collections.employee).findOne(
          { 'employeeId': decoded.preferred_username },
          { 'admin': 1 },
          (error: any, docs: { admin: string }) => {
            if (error) {
              errorQuery(context);
              return context.done();
            } else {
              if (docs?.admin === 'write') {
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

  let query = {
    '_id': ObjectId(req.body.id),
  };

  const functionQuery = (db: Db) => {
    db.collection(collections.customer)
      .find({ '_id': ObjectId(req.body.id) })
      .toArray((error: any, docs: any) => {
        if (error) {
          errorQuery(context);
          return context.done();
        }
        if (docs.length === 0) {
          errorWrongInput(context, 'No customer found');
          return context.done();
        }

        db.collection(collections.customer).deleteOne(query, (error: any, docs: any) => {
          if (error) {
            errorQuery(context);
            return context.done();
          }

          //Deletes the supplier for customers
          db.collection(collections.employee).updateMany(
            { 'customers.id': ObjectId(req.body.id) },
            { $pull: { customers: { 'id': ObjectId(req.body.id) } } },
            (error: any, docs: any) => {
              if (error) {
                errorQuery(context);
                return context.done();
              }

              let msg = JSON.parse('{}');
              msg['n'] = 'Found ' + docs.result.n + ' employees with the customer.';
              msg['nModified'] = 'Modified ' + docs.result.nModified + ' employees.';
              msg['res'] = 'Customer deleted.';

              returnResult(context, msg);
              context.done();
            }
          );
        });
      });
  };

  inputValidation();
};
