import { Context, HttpRequest } from '@azure/functions';
import { returnResult } from '../SharedFiles/dataValidation';
import { getKey, options, prepToken, errorQuery, errorUnauthorized } from '../SharedFiles/auth';
import { verify } from 'jsonwebtoken';
import { collections, connectRead } from '../SharedFiles/dataBase';
import { Db, Decoded } from '../SharedFiles/interfaces';

/**
 * @description Function that returns all the employees
 * @param context - passed from the Azure function runtime, used to store information about/from the function
 * @return context.res.body that contains a JSON object that is an array of JSON objects for each employee
 */
export default (context: Context, req: HttpRequest): any => {
  let employeeId: any;

  let token = prepToken(context, req.headers.authorization);

  if (token === null) {
    errorUnauthorized(context, 'Token is null');
    return context.done();
  }

  /**
   * @description Function that checks if user has sufficient permission level. If sufficient, calls functionQuery, else finishes context
   * @param db read access to the database, needed to check permission level
   */
  const authorize = (db: Db) => {
    verify(token, getKey, options, (err: any, decoded: Decoded) => {
      // Verified and decoded token
      if (err) {
        errorUnauthorized(context, 'Token not valid');
        return context.done();
      } else {
        employeeId = decoded.preferred_username;

        db.collection(collections.employee) // query to find users permission level
          .find({ 'employeeId': employeeId })
          .project({ 'admin': 1 })
          .toArray((error: any, docs: JSON | JSON[]) => {
            if (error) {
              errorQuery(context);
              return context.done();
            } else {
              if (docs[0]?.admin === 'write' || docs[0]?.admin === 'read') {
                functionQuery(db);
              } else {
                errorUnauthorized(context, 'User dont have admin-write/read permission');
                return context.done();
              }
            }
          });
      }
    });
  };

  /**
   * @description Query that asks for all employees in the database
   * @param db read access to database, needed to recieve all employees
   * @return context.res.body that contains a JSON object that is an array of JSON objects for each employee
   */
  const functionQuery = (db: Db) => {
    db.collection(collections.employee)
      .find()
      .project()
      .toArray((error: any, docs: any) => {
        if (error) {
          errorQuery(context);
          return context.done();
        }
        let employees = docs;
        db.collection(collections.customer)
          .find()
          .project({ '_id': 1, 'name': 1 })
          .toArray((error: any, docs: any) => {
            if (error) {
              errorQuery(context);
              return context.done();
            }
            let customers = docs;
            employees.forEach((employee) => {
              if (employee.admin === 'write') {
                customers.forEach((customer) => (customer['permission'] = 'write'));
                employee['customerInformation'] = customers;
              } else {
                let customerInformation = customers.filter((customer) =>
                  JSON.stringify(employee.customers).includes(JSON.stringify(customer._id))
                );
                employee.customerInformation = [];
                customerInformation.forEach((customer, index) => {
                  try {
                    employee.customerInformation.push({
                      '_id': customer._id,
                      'name': customer.name,
                      'permission': employee['customers'][index]['permission'],
                    });
                  } catch {}
                });
              }

              delete employee.customers;
            });
            returnResult(context, employees);
            context.done();
          });
      });
  };

  connectRead(context, authorize);
};
