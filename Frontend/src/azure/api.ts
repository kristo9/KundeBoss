import { apiConfig } from './apiConfig';
import { getTokenRedirect } from './authRedirect';
import { tokenRequest } from './authConfig';

let username = null;

function callApi(endpoint, token, data) {
  const headers = new Headers();
  const bearer = `Bearer ${token}`;
  data = data ? JSON.stringify(data) : {};

  headers.append('Authorization', bearer);

  const options = {
    method: 'POST',
    headers: headers,
    body: data,
  };

  console.log(options);

  console.log('Calling Web API...');

  return fetch(endpoint, options)
    .then((response) => response.json())
    .then((response) => {
      if (response) {
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
        try {
          return callApi(apiConfig.uri + apiName, response.accessToken, data);
        } catch (error) {
          console.warn(error);
        }
      }
    })
    .catch((error) => {
      console.error(error);
    });
}

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

export function newCustomer(
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
  //mailgroup: null
) {
  const data = {
    name: name,
    phone: phone,
    mail: mail,
    contactName: contactName,
    suppliers: suppliers,
    tags: tags,
    comment: comment,
    infoReference: infoReference,
  };
  return prepareCall('NewCustomer', data);
}
/*
newSupplier('Nasjonal catering', 'Padme@NC.com', 74839283, 'Padmé Amidala Naberrie', 'Senator of Naboo, former Queen of Naboo')
*/
export function newSupplier(
  name: string,
  mail: string,
  phone: number = null,
  contactName: string = null,
  comment: string = null
  //mailgroup: null
) {
  const data = {
    name: name,
    phone: phone,
    mail: mail,
    contactName: contactName,
    comment: comment,
  };

  return prepareCall('NewSupplier', data);
}

export function getCustomer(id: string) {
  let customerId = {
    id: id,
  };
  return prepareCall('GetCustomerData', customerId);
}

export function getEmployee(tag = null): Promise<any> {
  tag = {
    tag: tag,
  };
  return prepareCall('GetCustomers', tag);
}

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

export function setUsername(user) {
  username = user;
}

export function isLogedIn() {
  let validate = null;
  if (username != null) {
    validate = username;
    console.log(validate);
    return validate;
  } else {
    console.log(validate);
    return validate;
  }
}

export function logToken() {
  getTokenRedirect(tokenRequest).then((response) => {
    if (response) console.log(response.accessToken);
  });
}
