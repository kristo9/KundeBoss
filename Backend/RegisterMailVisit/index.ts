import { Context, HttpRequest } from '@azure/functions';
import { prepInput, returnResult } from '../SharedFiles/dataValidation';
import { getKey, options, prepToken, errorQuery, errorUnauthorized } from '../SharedFiles/auth';
import { checkDbConnection, clientRead, collections, connectRead, connectWrite } from '../SharedFiles/dataBase';
import { verify } from 'jsonwebtoken';
import { Db, Decoded } from '../SharedFiles/interfaces';
import { ObjectId } from 'mongodb';

/**
 * @description Returns information about caller from database, or creates a new entry in databse if caller is not found in the database
 * @param contect : Context
 * @param req : HttpRequest
 */
export default (context: Context, req: HttpRequest): any => {
  let username = null;
  req.body = prepInput(context, req?.body);
  if (req.body === null) {
    return context.done();
  }

  /* Checks that header includes a token. Returns if there are no token */
  let token = prepToken(context, req?.headers?.authorization);
  if (token === null) {
    return context.done();
  }

  /**
   * @description Validates that id provided in req.body has right format. Returns if it isn't
   * @returns contect.done()
   */
  const authorize = (db: Db) => {
    verify(token, getKey, options, (err: any, decoded: Decoded) => {
      // verified and decoded token
      if (err) {
        errorUnauthorized(context, 'Token not valid');
        return context.done();
      } else {
        username = decoded.preferred_username;
        connectWrite(context, functionQuery);
      }
    });
  };

  /**
   * @description Looks for emplyees in database. If none are found, a new admin is created. If the caller is not found, they are inserted into the databse
   * @param db : db connection
   */
  const functionQuery = (db: Db) => {
    let query = { '_id': ObjectId(req.body.id) };
    let update = { '$addToSet' :{'seenBy': username }}
    db.collection(collections.mail).updateOne(query,update,(error:any,docs:any)=>{
      if(error){
        errorQuery(context)
        return context.done()
      }
      returnResult(context,docs),
      context.done();
    })
  };

  connectRead(context, authorize);
};
