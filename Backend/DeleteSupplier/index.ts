import { Context, HttpRequest } from '@azure/functions';
import { prepInput, mailVal, returnResult, errorWrongInput } from '../SharedFiles/dataValidation';
import { getKey, options, prepToken, errorQuery, errorUnauthorized } from '../SharedFiles/auth';
import { verify } from 'jsonwebtoken';
import { connectRead, connectWrite } from '../SharedFiles/dataBase';
import { Db, Decoded } from '../SharedFiles/interfaces';
import { ObjectId } from 'mongodb';

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
    'contact.mail': req.body.mail,
  };

  const functionQuery = (db: Db) => {
    db.collection('supplier')
      .find({ 'contact.mail': req.body.mail })
      .toArray((error: any, docs: any) => {
        if (error) {
          errorQuery(context);
          return context.done();
        }

        let mailGroup = docs[0].mailGroup;

        db.collection('mailGroup')
          .find(ObjectId(mailGroup))
          .toArray((error: any, docs: any) => {
            if (error) {
              errorQuery(context);
              return context.done();
            }

            var array = [];
            docs[0].mails.forEach((itm) => {
              array.push(itm);
            });

            const mailQuery = {
              '_id': { $in: array },
            };

            db.collection('mail').deleteMany(mailQuery, (error: any, docs: any) => {
              if (error) {
                errorQuery(context);
                return context.done();
              }
              console.log('Mails deleted!');

              db.collection('mailGroup').deleteOne({ _id: ObjectId(mailGroup) }, (error: any, docs: any) => {
                if (error) {
                  errorQuery(context);
                  return context.done();
                }
                console.log('MailGroup deleted!');

                db.collection('supplier').deleteOne(query, (error: any, docs: any) => {
                  if (error) {
                    errorQuery(context);
                    return context.done();
                  }
                  console.log('Supplier deleted!');

                  returnResult(context, docs);
                  context.done();
                });
              });
            });
          });
      });
  };

  inputValidation();
};
