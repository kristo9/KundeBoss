import { apiConfig } from "./apiConfig";
import { getTokenRedirect } from "./authRedirect";
import { tokenRequest } from "./authConfig";

let username = null;

export function callApi(endpoint, token, data) {

  const headers = new Headers();
  const bearer = `Bearer ${token}`;

  headers.append("Authorization", bearer);

  const options = {
    method: "POST",
    headers: headers,
    body: data
  };

  console.log('Calling Web API...');
  
  return fetch(endpoint, options)
    .then(response => response.json())
    .then(response => {

      if (response) {
        //ui.logMessage('Web API responded: Hello ' + response['name'] + '!');
        return response;
      }
    }).catch(error => {
      console.error(error);
    });
}

function prepareCall(apiName, data = {}) {

  return getTokenRedirect(tokenRequest)
    .then(response => {
      if (response) {
        console.log("access_token acquired at: " + new Date().toString());
        try {
          return callApi(apiConfig.uri + apiName, response.accessToken, data);
        } catch (error) {
          console.warn(error);
        }
      }
    }).catch(error => {
      console.error(error);
    });
}

export function callLogin() {
  if (username) {

    getTokenRedirect(tokenRequest)
      .then(response => {
        if (response)
          console.log(response.accessToken)
      });
    return prepareCall("LoginTrigger")
      .then(response => {
        console.log("Called login func");
      });
  }
}

export function getEmployee() {
  return prepareCall("GetCustomers");
}


export function setUsername(user) {
  username = user;
}

export function isLogedIn() {
  let validate = null;
  console.log(validate);
  if(username != null) {validate = username; return validate}
  else return validate;
}

export function logToken() {

  getTokenRedirect(tokenRequest)
    .then(response => {
      if (response)
        console.log(response.accessToken)
    });
}