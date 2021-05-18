import { Context, HttpRequest } from '@azure/functions';
import { returnResult, errorWrongInput, _idVal } from '../SharedFiles/dataValidation';
import { getKey, options, prepToken, errorQuery, errorUnauthorized } from '../SharedFiles/auth';
import { verify } from 'jsonwebtoken';
import { collections, connectRead } from '../SharedFiles/dataBase';
import { Db, Decoded } from '../SharedFiles/interfaces';

/**
 * @description Gets all suppliers in the database
 * @param contect : Context
 * @param req : HttpRequest
 */
export default (context: Context, req: HttpRequest): any => {
  let employeeId: any;

  /* Checks that header includes a token. Returns if there are no token */
  let token = prepToken(context, req.headers.authorization);
  if (token === null) {
    errorUnauthorized(context, 'Token is null');
    return context.done();
  }

  /**
   * @description validates token
   * @param db : db connection
   */
  const authorize = (db: Db) => {
    verify(token, getKey, options, (err: any, decoded: Decoded) => {
      if (err) {
        errorUnauthorized(context, 'Token not valid');
        return context.done();
      } else {
        employeeId = decoded.preferred_username;

        db.collection(collections.employee) //checks if user is in database
          .find({ 'employeeId': employeeId })
          .toArray((error: any, docs: JSON | JSON[]) => {
            if (error) {
              errorQuery(context);
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
                    if (docs?.admin === 'write' || docs?.admin === 'read') {
                      connectRead(context, functionQuery);
                    } else {
                      errorUnauthorized(context, 'User dont have admin permission');
                      return context.done();
                    }
                  }
                }
              );
            }
          });
      }
    });
  };

  /**
   * @description query db for getting all suppliers, and then only keeping id and names
   * @param db : db connection
   */
  const functionQuery = (db: Db) => {
    let customers = null;
    db.collection(collections.customer)
      .find()
      .project({ 'name': 1 })
      .toArray((error: any, docs: any) => {
        if (error) {
          errorQuery(context, 'Cant query customer collection');
          return context.done();
        } else {
          customers = docs;

          if (customers == null) {
            errorWrongInput(context, 'No customer found');
            return context.done();
          }

          returnResult(context, customers);
          context.done();
        }
      });
  };

  connectRead(context, authorize);
};
