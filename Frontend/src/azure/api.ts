import { apiConfig } from './apiConfig';
import { getTokenRedirect } from './authRedirect';
import { tokenRequest } from './authConfig';
import { stat } from 'fs';

function callApi(endpoint, token, data) {
  const headers = new Headers();
  const bearer = `Bearer ${token}`;
  data = data ? JSON.stringify(data) : {};

  headers.append('Authorization', bearer);

  /*   interface pre {
    method: string;
    headers: any;
    body: any;
    role?: boolean;
  }
  let options: pre;
  options = {
    method: 'POST',
    headers: headers,
    body: data,
  }; */

  let options = {
    method: 'POST',
    headers: headers,
    body: data,
  };

  /*   if (role !== null) options.role = role;
   */

  console.log(options);

  console.log('Calling Web API...');
  let status = null;
  return fetch(endpoint, options)
    .then((response) => {
      status = response.status;
      return response.json();
    })
    .then((response) => {
      if (response) {
        response['status'] = status;
        //ui.logMessage('Web API responded: Hello ' + response['name'] + '!');
        return response;
      }
    })
    .catch((error) => {
      console.error(error);
    });
}

function prepareCall(apiName, data = null) {
  return getTokenRedirect(tokenRequest)
    .then((response) => {
      if (response) {
        console.log('access_token acquired at: ' + new Date().toString());
        console.log(response.accessToken);
        //let role = response.account.idTokenClaims.roles[0];
        console.log(response);
        try {
          return callApi(apiConfig.uri + apiName, response.accessToken, data); //,role);
        } catch (error) {
          console.warn(error);
        }
      }
    })
    .catch((error) => {
      console.error(error);
    });
}
/**
 * @description
 * @returns
 */
export function callLogin() {
  console.log('callLogin');
  return prepareCall('LoginTrigger').then((response) => {
    return response;
  });
}

/*     const suppliers = [
      {
        'id' : '604a7ba6fe05bd49dcb6b7a3',
        'name': "t"
       },
       {
         'id':'604a7e8f4ce34420cc732813',
         'name': "t"
       }
    ];
    const tags = [
      "Viktig Kunde",
      "Gjerrig"
    ];
    var suppliersObject = JSON.parse(JSON.stringify(suppliers));
    newCustomer('Timinski Corp.', 'Timain@timinski.gg', 12312312, "Timain", suppliersObject, tags, "CC Corp", "inforRef??" ) */
/**
 * @description Creates new customer
 * @param id id of the customer you want to change. Use null to create a new customer
 * @param name name of company
 * @param mail mail to contact person
 * @param phone phone number to contact person
 * @param contactName name of contactperson
 * @param suppliers array, contains json objects (id, name) of suppliers
 * @param tags array, contains strings of tags
 * @param comment string,
 * @param infoReference
 * @returns json object ?
 */
export function newCustomer(
  id: string,
  name: string,
  mail: string,
  phone: number = null,
  contactName: string = null,
  suppliers: [] = null,
  tags: string[] = null,
  comment: string = null,
  //types: [] = null,
  //typeValues: [] = null,
  //customerAgreements: [],
  infoReference: string = null
) {
  const data = {
    name,
    phone,
    mail,
    contactName,
    suppliers,
    tags,
    comment,
    infoReference,
    id,
  };
  return prepareCall('NewCustomer', data);
}

/*
newSupplier('Nasjonal catering', 'Padme@NC.com', 74839283, 'Padmé Amidala Naberrie', 'Senator of Naboo, former Queen of Naboo')
*/
/**
 * @description Creates a new supplier
 * @param id id of the supplier you want to change. Use null to create a new supplier
 * @param name
 * @param mail
 * @param phone
 * @param contactName
 * @param comment
 * @returns
 */
export function newSupplier(
  id: string,
  name: string,
  mail: string,
  phone: number = null,
  contactName: string = null,
  comment: string = null
  //mailgroup: null
) {
  const data = {
    name,
    phone,
    mail,
    contactName,
    comment,
    id,
  };

  return prepareCall('NewSupplier', data);
}

/**
 * @description Send mail to a customer and their suppliers
 * @param customerId : ObjectId
 * @param includeCustomer
 * @param text
 * @param subject
 * @param supplierIds : Optional, Array with the suppliers ObjectIds
 * @returns
 */

export function sendMailCustomer(
  customerId: string,
  includeCustomer: boolean,
  text: string,
  subject: string,
  supplierIds: string[] = []
) {
  const data = {
    customerId: {
      id: customerId,
      include: includeCustomer ? 'true' : 'false',
    },
    text,
    subject,
    supplierIds,
  };
  return prepareCall('SendMailCustomer', data);
}

/*      <button onClick={async () => {
          console.log("Her skal det komme tekst: ")
          console.log(await getAllEmployees())
          console.log("------------------------")}}>
          KNAPP
        </button>
        */
/**
 * @description Gets all the employees and their data
 * @returns an array of JSON objects with:<br>
 *  'name'                              - string<br>
 *  'employeeId'                        - string<br>
 *  'admin'                             - string<br>
 *  'customerInformation'               - array<br>
 *  'customerInformation._id'           - objectId<br>
 *  'customerInformation.name'          - string<br>
 *  'customerInformation.permission'    - string<br>
 *
 */
export function getAllEmployees() {
  return prepareCall('GetAllEmployees');
}

/**
 * @description Gets all the employees and their suppliers
 * @returns an array of JSON objects with:<br>
 *  'customer._id'                      - string<br>
 *  'customer.name'                     - string<br>
 *  'customer.suppliers'                - array<br>
 *  'customer.suppliers._id'            - objectId<br>
 *  'customer.suppliers.name'           - string<br>
 */
export function getCustomersAndSuppliers() {
  return prepareCall('GetCustomersAndSuppliers');
}

/**
 * @description Gets information about the customer that was provided as a parameter
 * @param id customer mongodb id
 * @returns
 */
export function getCustomer(id: string) {
  let customerId = {
    id: id,
  };
  return prepareCall('GetCustomerData', customerId);
}
/**
 * Gets information about a supplier
 * @param id supplier mongodb id
 * @returns json object
 */
export function getSupplier(id: string) {
  let supplierId = {
    id: id,
  };
  return prepareCall('GetSupplierData', supplierId);
}

/**
 * @description Gets all customers that the user has access to. Return may be customized by tags
 * @param tag Keywords that some customers have attached
 * @returns a JSON object with:<br>
 *   '_id'                              - objectId<br>
 *  'name'                              - string<br>
 *  'employeeId'                        - string<br>
 *  'customerInformation'               - array<br>
 *  'customerInformation._id'           - objectId<br>
 *  'customerInformation.name'          - string<br>
 *  'customerInformation.contact.name'  - string<br>
 *  'customerInformation.contact.mail'  - string<br>
 *  'customerInformation.tags'          - array<br>
 */
export function getEmployee(tag = null): Promise<any> {
  tag = {
    tag: tag,
  };
  return prepareCall('GetCustomers', tag);
}

/**
 * @description Deletes a employee, the employees mails and mailGroup from the database
 * @param mail Mail to the employee which is to be deleted
 * @returns returns result. if result.n = 1 the employee is deleted.
 */
export function deleteEmployee(mail) {
  const data = {
    mail: mail,
  };
  return prepareCall('DeleteEmployee', data);
}

/**
 * @description Deletes a customer, the customers mails and mailGroup from the database
 * @param mail Mail to the customer which is to be deleted
 * @returns returns result. if result.n = 1 the customer is deleted.
 */
export function deleteCustomer(mail) {
  const data = {
    mail: mail,
  };
  return prepareCall('DeleteCustomer', data);
}

/**
 * @description Deletes a supplier, the suppliers mails and mailGroup from the database
 * @param mail Mail to the supplier which is to be deleted
 * @returns returns result. if result.n = 1 the supplier is deleted.
 */
export function deleteSupplier(mail) {
  const data = {
    mail: mail,
  };
  return prepareCall('DeleteSupplier', data);
}
/**
 * @description Modifies employee data
 * @param employeeId the mail of employee
 * @param name name of employee
 * @param admin admin lvl of employee
 * @param isCustomer
 * @param customers usually JSON object ?
 * @returns
 */
export function modifyEmployeeData(
  employeeId: string = null,
  name: string = null,
  admin: string = null,
  isCustomer: boolean = null,
  customers: any
) {
  console.log('Calling ModifyEmployeeData function');
  const data = {
    employeeId: employeeId,
    name: name,
    admin: admin,
    isCustomer: isCustomer,
    customers: customers,
  };

  return prepareCall('ModifyEmployeeData', data);
}

export function logToken() {
  getTokenRedirect(tokenRequest).then((response) => {
    if (response) console.log(response.accessToken);
  });
}
