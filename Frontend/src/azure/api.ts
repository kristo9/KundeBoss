import { apiConfig } from './apiConfig';
import { getTokenRedirect, msalInstance } from './authRedirect';
import { tokenRequest } from './authConfig';
import { addToCacheAndReturn, deleteCache, getFromCache } from './caching';
import { ArrayDestructuringAssignment } from 'typescript';

function callApi(endpoint, token, data) {
  const headers = new Headers();
  const bearer = `Bearer ${token}`;
  data = data ? JSON.stringify(data) : {};

  headers.append('Authorization', bearer);

  let options = {
    method: 'POST',
    headers: headers,
    body: data,
  };

  console.log('Calling Web API...');
  let status = null;
  return fetch(endpoint, options)
    .then((response) => {
      status = response.status;
      console.log(status);
      console.log(response);
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

async function prepareCall(apiName, data = null) {
  let i = 0;
  while (msalInstance.getActiveAccount() === null) {
    await new Promise((r) => setTimeout(r, 10));
    if (++i > 99) {
      return;
    }
  }

  return getTokenRedirect(tokenRequest)
    .then((response) => {
      if (response) {
        console.log('access_token acquired at: ' + new Date().toString());
        if (apiName === 'LoginTrigger') console.log(response.accessToken);
        //let role = response.account.idTokenClaims.roles[0];
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
 * @desc Checks if the object called for has been stored in cache.
 * Calls api and adds it to the cache if it isn't.
 * @param apiName
 * @param data
 * @returns Object
 */
async function prepareCallWithCaching(apiName: string, data = null) {
  let key = data?.id;
  if (!key) {
    key = apiName;
  }
  let cachedObject = await getFromCache(key);

  if (cachedObject !== null) {
    return cachedObject;
  }
  return addToCacheAndReturn(key, prepareCall(apiName, data));
}
/**
 * @desc Calls the api and clears the cache.
 * @param apiName
 * @param key
 * @returns Object
 */
function prepareCallAndDeleteCache(apiName: string, data = null, key = null) {
  deleteCache(key);
  return prepareCall(apiName, data);
}

/**
 * @description
 * @returns
 */
export function callLogin() {
  return prepareCallWithCaching('LoginTrigger').then((response) => {
    return response;
  });
}

/*     const suppliers = [
  {
    'id': '605b42ee425cc56cf089a7ff',
    'contactName': 'Padmé Amidala Naberrie',
    'mail': 'Padme@NC.com',
    'phone': 74839283,
  },
  {
    'id': '605b37b56c35ab18d8c49da9',
    'contactName': null,
    'mail': 'didbje@gmail.com',
    'phone': null,
  },
];
    const tags = [
      "Viktig Kunde",
      "Gjerrig"
    ];
    var suppliersObject = JSON.parse(JSON.stringify(suppliers));
    await newCustomer(null,'Lando Traveling Agency', 'lando.cal@LTA.net',48101993,'Lando Calrissian',  suppliers, tags, "CC Corp", "inforRef??" ) */
/**
 * @description Creates new customer
 * @param id id of the customer you want to change. Use null to create a new customer
 * @param name name of company
 * @param mail mail to contact person
 * @param phone phone number to contact person
 * @param contactName name of contactperson
 * @param suppliers array of json objects (id, contactName, mail, phone) of suppliers
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
  suppliers: {
    id: string;
    contact: {
      name: string;
      mail: string;
      phone: number;
    };
  }[] = null,
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
  console.log(data.suppliers);
  return prepareCallAndDeleteCache('NewCustomer', data);
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

  return prepareCallAndDeleteCache('NewSupplier', data);
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
  return prepareCallAndDeleteCache('SendMailCustomer', data, customerId);
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
  return prepareCallWithCaching('GetAllEmployees');
}

/**
 * @description Gets all the customers id and names
 * @returns an array of JSON objects with:<br>
 *  '_id'                               - objectId<br>
 *  'name'                              - string<br>
 */
export function getAllCustomer() {
  return prepareCallWithCaching('GetAllCustomers');
}

/**
 * @description Gets all the suppliers
 * @returns an array of JSON objects with:<br>
 *  '_id'                         - string<br>
 *  'name'                        - string<br>
 */
export function getAllSuppliers() {
  return prepareCallWithCaching('GetAllSuppliers');
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
  return prepareCallWithCaching('GetCustomersAndSuppliers');
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
  return prepareCallWithCaching('GetCustomerData', customerId);
}

/**
 * @description Register that a mail was opened
 * @param id customer mongodb id
 * @returns
 */
export function registerMailVisit(id: string) {
  let mailId = {
    id,
  };
  // deleteCache(customerId);
  prepareCall('RegisterMailVisit', mailId); //.then(() => getCustomer(customerId));
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
  return prepareCallWithCaching('GetSupplierData', supplierId);
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
  if (tag.tag === null) {
    return prepareCallWithCaching('GetCustomers');
  }

  return prepareCall('GetCustomers', tag);
}

/**
 * @description Deletes a employee, the employees mails and mailGroup from the database
 * @param id Mail to the employee which is to be deleted
 * @returns returns result. if result.n = 1 the employee is deleted.
 */
export function deleteEmployee(id: string) {
  const data = {
    id: id,
  };
  return prepareCallAndDeleteCache('DeleteEmployee', data);
}

/**
 * @description Deletes a customer, the customers mails and mailGroup from the database
 * @param id Mail to the customer which is to be deleted
 * @returns returns result. if result.n = 1 the customer is deleted.
 */
export function deleteCustomer(id: string) {
  const data = {
    id: id,
  };
  return prepareCallAndDeleteCache('DeleteCustomer', data);
}

/**
 * @description Deletes a supplier, the suppliers mails and mailGroup from the database
 * @param id Mail to the supplier which is to be deleted
 * @returns returns result. if result.n = 1 the supplier is deleted.
 */
export function deleteSupplier(id: string) {
  const data = {
    id: id,
  };
  return prepareCallAndDeleteCache('DeleteSupplier', data);
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
  customers: {
    id: string;
    permission: string;
  }[]
) {
  console.log('Calling ModifyEmployeeData function');
  const data = {
    employeeId: employeeId,
    name: name,
    admin: admin,
    isCustomer: isCustomer,
    customers: customers,
  };

  return prepareCallAndDeleteCache('ModifyEmployeeData', data);
}

export function logToken() {
  getTokenRedirect(tokenRequest).then((response) => {
    if (response) console.log(response.accessToken);
  });
}
