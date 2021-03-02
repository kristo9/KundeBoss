import { Context, HttpRequest } from '@azure/functions';
import { returnResult } from '../SharedFiles/dataValidation';
import { getKey, options, prepToken, errorQuery, errorUnauthorized } from '../SharedFiles/auth';
import { verify } from 'jsonwebtoken';
import { connectRead } from '../SharedFiles/dataBase';
import { Db, Decoded } from '../SharedFiles/interfaces';

module.exports = (context: Context, req: HttpRequest): any => {
  let employeeId: any;

  let token = prepToken(context, req.headers.authorization);

  if (token === null) {
    return context.done();
  }

  const authorize = (db: Db) => {
    verify(token, getKey, options, (err: any, decoded: Decoded) => {
      // verified and decoded token
      if (err) {
        errorUnauthorized(context, 'Token not valid');
        return context.done();
      } else {
        employeeId = decoded.preferred_username;
        functionQuery(db);
      }
    });
  };

  const projection = {
    'name': 1,
    'employeeId': 1,
    'customerInformation._id': 1,
    'customerInformation.name': 1,
    'customerInformation.contact.name': 1,
    'customerInformation.contact.mail': 1,
    'customerInformation.tags': 1
  };

  const functionQuery = (db: Db) => {
    db.collection('employee')
      .aggregate([
        {
          '$match': {
            'employeeId': employeeId
          }
        },
        {
          '$lookup': {
            'from': 'customer',
            'localField': 'customers.id',
            'foreignField': '_id',
            'as': 'customerInformation'
          }
        }
      ])
      .project(projection)
      .toArray((error: any, docs: JSON) => {
        if (error) {
          errorQuery(context);
          return context.done();
        } else {
          if (req.body && req.body.tag) {
            // Search for custoemrs that matches tag search

            let customerTagMatch = JSON.parse('[]');

            for (let i = 0; i < docs[0].customerInformation.length; ++i) {
              for (let j = 0; j < docs[0].customerInformation[i].tags.length; ++j) {
                if (docs[0].customerInformation[i].tags[j].toLowerCase().includes(req.body.tag.toLowerCase())) {
                  customerTagMatch.push(docs[0].customerInformation[i]);
                  break;
                }
              }
            }
            docs[0].customerInformation = customerTagMatch;
          }

          returnResult(context, docs[0]);
          context.done();
        }
      });
  };

  connectRead(context, authorize);
};
