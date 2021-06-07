import { Context, HttpRequest } from '@azure/functions';
import { prepInput, nameVal, mailVal, returnResult, errorWrongInput, _idVal } from '../SharedFiles/dataValidation';
import { getKey, options, prepToken, errorQuery, errorUnauthorized } from '../SharedFiles/auth';
import { verify } from 'jsonwebtoken';
import { collections, connectRead, connectWrite } from '../SharedFiles/dataBase';
import { Db, Decoded } from '../SharedFiles/interfaces';
import { ObjectId } from 'mongodb';
/**
 * @description Updates supplier if a supplier id was received. Creates a new supplier otherwise.
 */
export default (context: Context, req: HttpRequest): any => {
  req.body = prepInput(context, req.body);

  if (req.body === null) return context.done();

  let token = prepToken(context, req.headers.authorization);

  if (token === null) return context.done();

  /**
   * @description Validates that required input have been reveived
   * @returns 
   */
  const inputValidation = () => {
    let errMsg = 'Error: ';
    let validInput = true;

    if (req.body?.id && !_idVal(req.body?.id)) {
      errMsg += 'Not valid id. ';
      validInput = false;
    }
    if (!nameVal(req.body?.name)) {
      errMsg += 'Not valid name. ';
      validInput = false;
    }
    if (!mailVal(req.body?.mail)) {
      errMsg += 'Not valid mail.';
      validInput = false;
    }
    if (validInput) {
      connectRead(context, authorize);
    } else {
      errorWrongInput(context, errMsg);
      return context.done();
    }
  };

  /**
   * @description Checks have admin write permission
   * @param db 
   */
  const authorize = (db: Db) => {
    verify(token, getKey, options, (err: any, decoded: Decoded) => {
      // verified and decoded token
      if (err) {
        errorUnauthorized(context, 'Token not valid');
        return context.done();
      } else {
        db.collection(collections.employee).findOne(
          {
            'employeeId': decoded.preferred_username,
          },
          {
            'admin': 1,
          },
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

  /**
   * @description Updates supplier if a supplier id was received. Creates a new supplier otherwise.
   * @param db 
   */
  const functionQuery = (db: Db) => {
    const query = req.body?.id ? { '_id': ObjectId(req.body.id) } : { '_id': new ObjectId() };

    const queryOptions = { upsert: req.body?.id ? false : true };

    let update = {
      '$set': {
        'name': req.body.name,
        'contact': {
          'phone': req.body.phone || null,
          'mail': req.body.mail,
          'name': req.body.contactName || null,
        },
        'comment': req.body.comment || null,
      },
    };

    if (!req.body?.id) {
      update.$set['mails'] = [];
    }

    db.collection(collections.supplier).updateOne(query, update, queryOptions, (error: any, docs: any) => {
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
