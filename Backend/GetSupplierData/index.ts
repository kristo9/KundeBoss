import { Context, HttpRequest } from '@azure/functions';
import { prepInput, returnResult, errorWrongInput, _idVal } from '../SharedFiles/dataValidation';
import { getKey, options, prepToken, errorQuery, errorUnauthorized } from '../SharedFiles/auth';
import { verify } from 'jsonwebtoken';
import { connectRead } from '../SharedFiles/dataBase';
import { Db, Decoded } from '../SharedFiles/interfaces';
import { ObjectId } from 'mongodb';

export = (context: Context, req: HttpRequest): any => {
  req.body = prepInput(context, req.body);

  if (req.body === null) {
    return context.done();
  }

  let token = prepToken(context, req.headers.authorization);

  if (token === null) {
    return context.done();
  }

  const inputValidation = () => {
    if (_idVal(req.body?.id)) {
      connectRead(context, authorize);
    } else {
      errorWrongInput(context, 'id recieved not valid format');
      return context.done();
    }
  };

  const authorize = (db: Db) => {
    verify(token, getKey, options, (err: any, decoded: Decoded) => {
      if (err) {
        errorUnauthorized(context, 'Token not valid');
        return context.done();
      } else {
        functionQuery(db);
      }
    });
  };

  const functionQuery = (db: Db) => {
    let supplier = null;
    db.collection('supplier').findOne({ '_id': ObjectId(req.body.id) }, { 'contact': 0 }, (error: any, docs: any) => {
      if (error) {
        errorQuery(context, 'Cant query supplier collection');
        return context.done();
      } else {
        supplier = docs;

        db.collection('customer')
          .find({ 'suppliers': { '$elemMatch': { 'id': ObjectId(req.body.id) } } })
          .project({
            'name': 1,
            'contact': 1,
            'suppliers': 1,
          })
          .toArray((error: any, docs: any) => {
            if (error) {
              errorQuery(context, 'Cant query customer collection');
              return context.done();
            } else {
              docs.forEach((customer, index, customers) => {
                customers[index]['supplier'] = customer.suppliers.find((element) => element.id == req.body.id);
                delete customers[index].suppliers;
              });

              supplier['customers'] = docs;
              returnResult(context, supplier);
              context.done();
            }
          });
      }
    });
  };

  inputValidation();
};
