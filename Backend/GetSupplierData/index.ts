import { Context, HttpRequest } from '@azure/functions';
import { prepInput, returnResult, errorWrongInput, _idVal } from '../SharedFiles/dataValidation';
import { getKey, options, prepToken, errorQuery, errorUnauthorized } from '../SharedFiles/auth';
import { verify } from 'jsonwebtoken';
import { collections, connectRead } from '../SharedFiles/dataBase';
import { Db, Decoded } from '../SharedFiles/interfaces';
import { ObjectId } from 'mongodb';

/**
 * @description Get all data about a supplier
 * @param contect : Context
 * @param req : HttpRequest
 */
export default (context: Context, req: HttpRequest): any => {
  let employeeId: any;
  /* Sanitizes input. Returns if there are no request body */
  req.body = prepInput(context, req.body);
  if (req.body === null) {
    return context.done();
  }

  /* Checks that header includes a token. Returns if there are no token */
  let token = prepToken(context, req.headers.authorization);
  if (token === null) {
    return context.done();
  }

  /**
   * @description Validates that id provided in req.body has right format. Returns if it isn't
   * @returns contect.done()
   */
  const inputValidation = () => {
    if (_idVal(req.body?.id)) {
      connectRead(context, authorize);
    } else {
      errorWrongInput(context, 'ID recieved not valid format');
      return context.done();
    }
  };

  /**
   * @description validates token
   * @param db : db connectiondd
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
              if (Object.keys(docs).length == 0) {
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
   * @description query db for all inforamtion about the specified customer
   * @param db : db connection
   */
  const functionQuery = (db: Db) => {
    let supplier = null;
    db.collection(collections.supplier).findOne(
      { '_id': ObjectId(req.body.id) },
      { 'contact': 0 },
      (error: any, docs: any) => {
        if (error) {
          errorQuery(context, 'Cant query supplier collection');
          return context.done();
        } else {
          supplier = docs;

          if (supplier == null) {
            errorWrongInput(context, 'No supplier found');
            return context.done();
          }
          /* Find all customers that have a relation with the supplier */
          db.collection(collections.customer)
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
                /* Remove excessive data about other suplliers from customers */
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
      }
    );
  };

  inputValidation();
};
