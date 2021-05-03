import { Context, HttpRequest } from '@azure/functions';
import { prepInput, errorWrongInput } from '../SharedFiles/dataValidation';
import { getKey, options, prepToken, errorQuery, errorUnauthorized } from '../SharedFiles/auth';
import { verify } from 'jsonwebtoken';
import { collections, connectRead, connectWrite } from '../SharedFiles/dataBase';
import { Db, Decoded } from '../SharedFiles/interfaces';

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

    if (!req.body?.name) {
      errMsg += 'No category name. ';
      validInput = false;
    }

    if (!req.body?.values || !Array.isArray(req.body.values)) {
      errMsg += 'No Values. ';
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
              console.log(docs);
              if (docs?.admin === 'write') {
                connectWrite(context, updateCategory);
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

  const query = {
    'name': req.body.name,
  };
  const update = {
    '$set': {
      'name': req.body.name,
      'values': req.body.values || [],
    },
  };
  const queryOptions = {
    upsert: true,
  };

  const updateCategory = (db: Db) => {
    db.collection(collections.customerCategory).updateOne(query, update, queryOptions, (error: any, docs: JSON) => {
      if (error) {
        errorQuery(context);
        return context.done();
      }
      updateCustomers(db);
    });
  };

  const updateCustomers = (db: Db) => {
    let query = {};
    query['categories.' + req.body.name] = { '$exists': true };

    db.collection(collections.customer)
      .find(query)
      .project({ 'categories': 1 })
      .toArray((error: any, docs: any) => {
        if (error) {
          errorQuery(context);
          return context.done();
        }
        let dbCalls = [docs.length];

        docs.forEach((customer) => {
          let category = customer.categories[req.body.name];

          let valuesToDelete = Object.keys(category).filter(
            (key) => !JSON.stringify(req.body.values).includes(JSON.stringify(key))
          );

          valuesToDelete.forEach((key) => delete category[key]);

          let valuesToAdd = req.body.values.filter((key) => !Object.keys(category).join().includes(key));

          valuesToAdd.forEach((key) => (category[key] = null));

          let update = { '$set': {} };
          update.$set['categories.' + req.body.name] = category;

          dbCalls.push(
            new Promise((resolve) => {
              db.collection(collections.customer).updateOne(
                { '_id': customer._id },
                update,
                (error: any, docs: any) => {
                  if (error) {
                    errorQuery(context);
                    return context.done();
                  }
                  resolve(docs);
                }
              );
            })
          );
        });

        Promise.all(dbCalls).then(() => context.done());
      });
  };

  inputValidation();
};
