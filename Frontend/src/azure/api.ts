import { apiConfig } from "./apiConfig";
//import { getTokenPopup } from "./authPopup";
import { getTokenRedirect } from "./authRedirect";

import { tokenRequest } from "./authConfig";

const ui = require("./ui");

let username = null;

export async function callApi(endpoint, token, data) {
  console.log(endpoint, token)
  const headers = new Headers();
  const bearer = `Bearer ${token}`;

  headers.append("Authorization", bearer);

  const options = {
    method: "POST",
    headers: headers,
    body: data
  };

  console.log('Calling Web API...');

  let retData = null;

  await fetch(endpoint, options)
    .then(response => response.json())
    .then(response => {

      if (response) {
        //ui.logMessage('Web API responded: Hello ' + response['name'] + '!');
        retData = response;
      }
    }).catch(error => {
      console.error(error);
    });
  return retData;
}

export function isLogedIn() {
  return username;
}

async function prepareCall(apiName, data = {}) {
  let retDataApi = null;
  await getTokenRedirect(tokenRequest)
    .then(async response => {
      if (response) {
        console.log("access_token acquired at: " + new Date().toString());
        try {
          retDataApi = await callApi(apiConfig.uri + apiName, response.accessToken, data);
        } catch (error) {
          console.warn(error);
        }
      }
    }).catch(error => {
      console.error(error);
    });

  username = retDataApi.name;

  return retDataApi;
}


export async function callLogin() {
  return await prepareCall("LoginTrigger");
}

export async function getEmployee() {
  return await prepareCall("GetCustomers");
}