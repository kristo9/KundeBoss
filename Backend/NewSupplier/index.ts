import { Context, HttpRequest } from '@azure/functions';
import { prepInput, nameVal, mailVal, returnResult, errorWrongInput } from '../SharedFiles/dataValidation';
import { getKey, options, prepToken, errorQuery, errorUnauthorized } from '../SharedFiles/auth';
import { verify } from 'jsonwebtoken';
import { connectRead, connectWrite } from '../SharedFiles/dataBase';
import { Db, Decoded } from '../SharedFiles/interfaces';
import { ObjectId } from 'mongodb';

module.exports = (context: Context, req: HttpRequest): any => {
  req.body = prepInput(context, req.body);

  if (req.body === null) return context.done();

  let token = prepToken(context, req.headers.authorization);

  if (token === null) return context.done();

  const inputValidation = () => {
    let errMsg = 'Error: ';
    let validInput = true;

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

  const authorize = (db: Db) => {
    verify(token, getKey, options, (err: any, decoded: Decoded) => {
      // verified and decoded token
      if (err) {
        errorUnauthorized(context, 'Token not valid');
        return context.done();
      } else {
        db.collection('employee').findOne(
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

  let query = {
    'name': req.body.name,
    'contact': {
      'phone': req.body.phone || null,
      'mail': req.body.mail,
      'name': req.body.contactName || null,
    },
    'customers': [],
    'comment': req.body.comment || null,
    'mailGroup': null,
  };

  const functionQuery = (db: Db) => {
    db.collection('mailGroup').insertOne({ 'mails': [] }, (error: any, docs: any) => {
      if (error) {
        errorQuery(context);
        return context.done();
      }
      query.mailGroup = ObjectId(docs.insertedId);
      db.collection('supplier').insertOne(query, (error: any, docs: JSON) => {
        if (error) {
          errorQuery(context);
          return context.done();
        }
        returnResult(context, docs);
        context.done();
      });
    });
  };

  inputValidation();
};

/* {
  "name":"",
  "mail":"",
} */
