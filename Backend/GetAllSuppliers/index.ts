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
        db.collection('employee') // query to find users permission level
          .find({ 'employeeId': employeeId })
          .project({ 'admin': 1 })
          .toArray((error: any, docs: JSON | JSON[]) => {
            if (error) {
              errorQuery(context);
              return context.done();
            } else {
              if (docs[0].admin === 'write') {
                functionQuery(db);
              } else {
                errorUnauthorized(context, 'User dont have admin-write permission');
                return context.done();
              }
            }
          });
      }
    });
  };

  /**
   * @description query db for all inforamtion about the specified customer
   * @param db : db connection
   */
  const functionQuery = (db: Db) => {
    let suppliers = null;
    db.collection('supplier')
      .find()
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

          suppliers.forEach((supplier) => {
            delete supplier.contact;
            delete supplier.comment;
            delete supplier.mailGroup;
          });

          returnResult(context, suppliers);
          context.done();
        }
      });
  };

  connectRead(context, authorize);
};
