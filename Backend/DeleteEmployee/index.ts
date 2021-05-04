import { Context, HttpRequest } from '@azure/functions';
import { prepInput, returnResult, errorWrongInput, _idVal } from '../SharedFiles/dataValidation';
import { getKey, options, prepToken, errorQuery, errorUnauthorized } from '../SharedFiles/auth';
import { verify } from 'jsonwebtoken';
import { connectRead, connectWrite } from '../SharedFiles/dataBase';
import { Db, Decoded } from '../SharedFiles/interfaces';
import { ObjectId } from 'mongodb';

/**
 * @description Deletes an employee
 * @param contect : Context
 * @param req : HttpRequest
 */
export default (context: Context, req: HttpRequest): any => {
  req.body = prepInput(context, req.body);

  if (req.body === null) return context.done();

  let token = prepToken(context, req.headers.authorization);

  if (token === null) return context.done();

  const inputValidation = () => {
    let errMsg = 'Error: ';
    let validInput = true;

    if (!_idVal(req.body?.id)) {
      errMsg += 'Not valid employee ID.';
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
        db.collection('employee').findOne(
          { 'employeeId': decoded.preferred_username },
          { 'admin': 1 },
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

  let query = {
    '_id': ObjectId(req.body.id),
  };

  const functionQuery = (db: Db) => {
    db.collection('employee').findOne(query, (error: any, docs: any) => {
      if (error) {
        errorQuery(context);
        return context.done();
      }
      if (docs.deletedCount === 0) {
        errorWrongInput(context, 'No employee found');
        return context.done();
      }

      console.log('Employee deleted!');
      returnResult(context, docs);
      context.done();
    });
  };

  inputValidation();
};
