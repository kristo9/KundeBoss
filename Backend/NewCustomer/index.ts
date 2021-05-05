import { Context, HttpRequest } from '@azure/functions';
import { prepInput, nameVal, mailVal, returnResult, errorWrongInput, _idVal } from '../SharedFiles/dataValidation';
import { getKey, options, prepToken, errorQuery, errorUnauthorized } from '../SharedFiles/auth';
import { verify } from 'jsonwebtoken';
import { collections, connectRead, connectWrite } from '../SharedFiles/dataBase';
import { Db, Decoded } from '../SharedFiles/interfaces';
import { ObjectId } from 'mongodb';

export default (context: Context, req: HttpRequest): any => {
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
    let mailGroup = null;

    const updateOrUpsertCustomer = () => {
      const query = req.body?.id ? { '_id': ObjectId(req.body.id) } : { '_id': new ObjectId() };

      const queryOptions = { upsert: req.body?.id ? false : true };

      if (req.body?.suppliers) {
        /*  req.body.suppliers.forEach((supplier) => {

        }); */
        req.body.suppliers = req.body.suppliers.map((id) => ObjectId(id));
      }

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
          'categories': req.body.categories,
        },
      };

      if (mailGroup) {
        update.$set['mailGroup'] = mailGroup;
      }

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

        updateOrUpsertCustomer();
      });
    } else {
      updateOrUpsertCustomer();
    }
  };

  inputValidation();
};

/* {
  "name":"",
  "mail":"",
} */
