import { apiConfig } from './apiConfig';
import { getTokenRedirect } from './authRedirect';
import { tokenRequest } from './authConfig';

let username = null;

function callApi(endpoint, token, data) {
  const headers = new Headers();
  const bearer = `Bearer ${token}`;

  headers.append('Authorization', bearer);

  const options = {
    method: 'POST',
    headers: headers,
    body: data,
  };

  console.log(options);

  console.log('Calling Web API...');

  return fetch(endpoint, options)
    .then((response) => {
      //temp, originalt: .then((response) => response.json();)
      const x = response.json();
      console.log(x);
      return x;
    })
    .then((response) => {
      console.log('Response', response);
      if (response) {
        //ui.logMessage('Web API responded: Hello ' + response['name'] + '!');
        return response;
      }
    })
    .catch((error) => {
      console.error(error);
      console.log('Error');
    });
}

function prepareCall(apiName, data = {}) {
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
  if (username) {
    getTokenRedirect(tokenRequest).then((response) => {
      if (response) console.log(response.accessToken);
    });
    return prepareCall('LoginTrigger').then((response) => {
      console.log('Called login func');
    });
  }
}

export function getEmployee(tag = {}) {
  if (tag) {
    tag = {
      'tag': tag,
    };
  }
  return prepareCall('GetCustomers', tag);
}

export function modifyEmployeeData(
  employeeId: string = null,
  name: string = null,
  admin: string = null,
  isCustomer: boolean = null,
  customers: any
) {
  console.log('Modifying employee data');
  const data = {
    'employeeId': employeeId,
    'name': name,
    'admin': admin,
    'isCustomer': isCustomer,
    'customers': customers,
  };
  console.log('EmployeeId: ' + employeeId);
  console.log(data);

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
