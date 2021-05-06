import { Context, HttpRequest } from '@azure/functions';
import { prepInput, nameVal, mailVal, _idVal, returnResult, errorWrongInput } from '../SharedFiles/dataValidation';
import { getKey, options, prepToken, errorQuery, errorUnauthorized } from '../SharedFiles/auth';
import { verify } from 'jsonwebtoken';
import { connectRead, connectWrite } from '../SharedFiles/dataBase';
import { Db, Decoded } from '../SharedFiles/interfaces';

/**
 * Function that returns all the employees
 * @param context - passed from the Azure function runtime, used to store information about/from the function
 * @param req - the httpRequest, in this case contains the authentification token and the info to be modified
 * @return information about what the query has done, not used for anything
 */
export default (context: Context, req: HttpRequest): any => {
  req.body = prepInput(context, req.body);

  if (req.body === null) {
    return context.done();
  }

  let token = prepToken(context, req.headers.authorization);
  let newVals = JSON.parse('{}'); // Makes new JSON object to store potential changes in employee
  newVals['isConfigured'] = true;

  if (token === null) {
    return context.done();
  }

  const inputValidation = () => {
    let errMsg = req.body;
    let validInput = true;

    const setError = (errorMsg: string = 'Wrong input') => {
      errMsg = errorMsg;
      validInput = false;
    };

    if (!req.body.employeeId) {
      errorWrongInput(context, 'Invalid employeeId.');
      return context.done();
    }

    if (req.body.name) {
      if (!nameVal(req.body.name)) {
        setError('Invalid name');
      }
      newVals['name'] = req.body.name;
    }

    if (req.body.employeeId) {
      if (!mailVal(req.body.employeeId)) {
        setError('Invalid mail/employeeId');
      }
      newVals['employeeId'] = req.body.employeeId;
    }

    if (req.body.customers) {
      req.body.customers.forEach((customer) => {
        context.log(customer['id']);
        if (!_idVal(customer['id']) || (customer['permission'] != 'read' && customer['permission'] != 'write')) {
          setError('Invalid id or permission');
        }
      });
      newVals['customers'] = req.body.customers;
    }

    if (req.body.admin) {
      if (req.body.admin != 'write' && req.body.admin != 'read') {
        setError('Invalid admin permission');
      }
      newVals['admin'] = req.body.admin;
    }

    if (req.body.isCustomer) {
      if (req.body.isCustomer != true && req.body.isCustomer != false) {
        setError('Invalid customer role');
      }
      newVals['isCustomer'] = req.body.isCustomer;
    }

    newVals = { $set: newVals }; // Adds the changes to the object

    if (validInput) {
      connectRead(context, authorize);
    } else {
      errorWrongInput(context, errMsg);
      return context.done();
    }
  };

  /**
   * Function that checks if user has sufficient permission level. If sufficient, calls connectWrite, else finishes context
   * @param db read access to database, needed to check permission level
   */
  const authorize = (db: Db) => {
    verify(token, getKey, options, (err: any, decoded: Decoded) => {
      if (err) {
        errorUnauthorized(context, 'Token not valid');
        return context.done();
      } else {
        db.collection('employee') // Check if user has access to the function
          .find({ employeeId: decoded.preferred_username })
          .project({ admin: 1 })
          .toArray((error: any, docs: { admin: string }[]) => {
            if (error) {
              errorQuery(context);
              return context.done();
            } else {
              if (docs[0].admin === 'write') {
                connectWrite(context, functionQuery);
              } else {
                errorUnauthorized(context, 'User dont have admin permission');
                return context.done();
              }
            }
          });
      }
    });
  };

  /**
   * Query that modifies the data of an employee
   * @param db write access to the database, needed to update information
   * @return information about what the query has done, not used for anything
   */
  const functionQuery = (db: Db) => {
    const query = { 'employeeId': req.body.employeeId };

    db.collection('employee').updateOne(query, newVals, (error: any, docs: JSON) => {
      // Updates employee
      if (error) {
        console.log(error);
        errorQuery(context);
        return context.done();
      }

      returnResult(context, docs);
      context.done();
    });
  };

  inputValidation();
};
