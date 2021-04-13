import { Context, HttpRequest } from '@azure/functions';
import { prepInput, nameVal, mailVal, returnResult, errorWrongInput, _idVal } from '../SharedFiles/dataValidation';
import { getKey, options, prepToken, errorQuery, errorUnauthorized } from '../SharedFiles/auth';
import { verify } from 'jsonwebtoken';
import { collections, connectRead, connectWrite } from '../SharedFiles/dataBase';
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

  const functionQuery = (db: Db) => {
    let val = [];
    let mailGroup = null;

    const getTypeValues = () => {
      db.collection(collections.customerType)
        .find({ 'name': { '$in': req.body.typeValues } })
        .project({ '_id': 0 })
        .toArray((error: any, docs: any) => {
          if (error) {
            errorQuery(context);
            return context.done();
          } else {
            docs.forEach((doc) => {
              doc.values.forEach((value) => {
                val.push(value);
              });
            });
            console.log(val);
            updateOrUpsertCustomer();
          }
        });
    };

    const updateOrUpsertCustomer = () => {
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
          'suppliers': req.body.suppliers || [],
          'tags': req.body.tags || [],
          'comment': req.body.comment || null,
          'customerAgreements': req.body.customerAgreements || [],
          'infoReference': req.body.infoReference || null,
          'types': req.body.typeValues,
          'values': [],
        },
      };

      val.forEach((value, index, values) => {
        update.$set.values.push({
          [values[index]]: null,
        });
      });

      if (req.body.values) {
        console.log(req.body.values);

        req.body.values.forEach((value) => {
          for (let i = 0, l = update.$set.values.length; i < l; ++i) {
            console.log(update.$set.values[i] + '  ' + Object.keys(value)[0]);

            if (Object.keys(update.$set.values[i])[0] == Object.keys(value)[0]) {
              update.$set.values[i] = value;

              break;
            }
            console.log(update.$set.values[i]);
          }
        });
      }

      if (mailGroup) {
        update.$set['mailGroup'] = mailGroup;
      }
      console.log(JSON.stringify(update, null, 2));

      db.collection(collections.customer).updateOne(query, update, queryOptions, (error: any, docs: any) => {
        if (error) {
          errorQuery(context);
          return context.done();
        }
        returnResult(context, docs);
        context.done();
      });
    };

    if (!req.body?.id) {
      db.collection('mailGroup').insertOne({ 'mails': [] }, (error: any, docs: any) => {
        if (error) {
          errorQuery(context);
          return context.done();
        }

        mailGroup = ObjectId(docs.insertedId);
        if (req.body.typeValues) {
          getTypeValues();
        } else {
          updateOrUpsertCustomer();
        }
      });
    } else {
      if (req.body.typeValues) {
        getTypeValues();
      } else {
        updateOrUpsertCustomer();
      }
    }
  };

  inputValidation();
};

/* {
  "name":"",
  "mail":"",
} */
