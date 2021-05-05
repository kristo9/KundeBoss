import { Context, HttpRequest } from '@azure/functions';
import { prepInput, returnResult, errorWrongInput, _idVal } from '../SharedFiles/dataValidation';
import { getKey, options, prepToken, errorQuery, errorUnauthorized } from '../SharedFiles/auth';
import { verify } from 'jsonwebtoken';
import { connectRead } from '../SharedFiles/dataBase';
import { Db, Decoded } from '../SharedFiles/interfaces';
import { ObjectId } from 'mongodb';

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

        db.collection('employee') //checks if user is in database
          .find({ 'employeeId': employeeId })
          .toArray((error: any, docs: JSON | JSON[]) => {
            if (error) {
              errorQuery(context);
              return context.done();
            } else {
              context.log(docs);
              if (Object.keys(docs).length == null) {
                console.log('No employee found');
                errorUnauthorized(context, 'User invalid');
                return context.done();
              } else {
                functionQuery(db);
              }
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
    let suppliers = null;
    db.collection('supplier')
      .find()
      .project({ 'name': 1 })
      .toArray((error: any, docs: any) => {
        if (error) {
          errorQuery(context, 'Cant query supplier collection');
          return context.done();
        } else {
          suppliers = docs;

          if (suppliers == null) {
            errorWrongInput(context, 'No supplier found');
            return context.done();
          }

          returnResult(context, suppliers);
          context.done();
        }
      });
  };

  connectRead(context, authorize);
};
