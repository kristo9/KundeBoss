import { Context, HttpRequest } from '@azure/functions';
import { returnResult } from '../SharedFiles/dataValidation';
import { getKey, options, prepToken, errorQuery, errorUnauthorized } from '../SharedFiles/auth';
import { checkDbConnection, clientRead, connectRead, connectWrite } from '../SharedFiles/dataBase';
import { verify } from 'jsonwebtoken';
import { Db, Decoded } from '../SharedFiles/interfaces';

/**
 * @description Returns information about caller from database, or creates a new entry in databse if caller is not found in the database
 * @param contect : Context
 * @param req : HttpRequest
 */
export default (context: Context, req: HttpRequest): any => {
  checkDbConnection(context, clientRead);

  let decodedToken = null;

  /* Checks that header includes a token. Returns if there are no token */
  let token = prepToken(context, req.headers.authorization);
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
        decodedToken = decoded;
        functionQuery(db);
      }
    });
  };

  /* Object that is returned in body.res */
  let result: JSON = JSON.parse('{}');
  result['firstLogin'] = false;
  result['isConfigured'] = false;
  result['admin'] = null;
  result['isCustomer'] = null;

  /**
   * @description Looks for emplyees in database. If none are found, a new admin is created. If the caller is not found, they are inserted into the databse
   * @param db : db connection
   */
  const functionQuery = (db: Db) => {
    result['name'] = decodedToken.name;

    db.collection('employee')
      .find()
      .project({
        _id: 0,
        employeeId: 1,
        admin: 1,
        isCustomer: 1,
      })
      .toArray((error: any, docs: any[]) => {
        if (error) {
          errorQuery(context);
          return context.done();
        } else {
          if (docs.length === 0) {
            /* Creates first entry in database */
            connectWrite(context, firstEmployee);
          } else {
            let employee = docs.find((employee) => employee.employeeId === decodedToken.preferred_username);

            if (employee == undefined) {
              /* Creates new entry in database for the function caller */
              connectWrite(context, createEmplyee);
            } else {
              /* Returns information about caller if they are already registered in the database */
              result['admin'] = employee.admin;
              if (employee.isCustomer !== null) {
                result['isConfigured'] = true;
                result['isCustomer'] = employee.isCustomer;
              }
              returnResult(context, result);
              context.done();
            }
          }
        }
      });
  };

  let query = JSON.parse('{}');
  query['name'] = null;
  query['employeeId'] = null;
  query['customers'] = [];
  query['admin'] = null;
  query['isCustomer'] = null;

  /**
   * @description Modifies query for creating new admin
   * @param db : database connection
   */
  const firstEmployee = (db: Db) => {
    context.log('Creating first employee with admin:write');
    query['admin'] = 'write';
    query['isCustomer'] = false;
    createEmplyee(db);
  };

  /**
   * @description Creates new employee
   * @param db : database connection
   */
  const createEmplyee = (db: Db) => {
    query['name'] = decodedToken.name;
    query['employeeId'] = decodedToken.preferred_username;

    db.collection('employee').insertOne(query, (error: any) => {
      if (error) {
        errorQuery(context);
        return context.done();
      }
      context.log('New employee created');

      result['firstLogin'] = true;

      returnResult(context, result);
      context.done();
    });
  };

  connectRead(context, authorize);
};
