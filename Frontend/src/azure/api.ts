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


export async function callLogin() {
  let retDataApi = null;
  await getTokenRedirect(tokenRequest)
    .then(async response => {
      if (response) {
        console.log("access_token acquired at: " + new Date().toString());
        try {
          retDataApi = await callApi(apiConfig.uri + "LoginTrigger", response.accessToken, {});
        } catch (error) {
          console.warn(error);
        }
      }
    }).catch(error => {
      console.error(error);
    });

  username = retDataApi.name;
  
  retDataApi["test"]="alex";
  retDataApi["abc"]="nfaso";
  
  retDataApi= {"Kunder": [
    {"name": "navn1", "epost": "epost1", "divText": "Div Text 1"},
    {"name": "navn2", "epost": "epost2", "divText": "Div Text 2"},
    {"name": "navn3", "epost": "epost3", "divText": "Div Text 3"},
    {"name": "navn4", "epost": "epost4", "divText": "Div Text 4"}
  ]
  }
  
  return retDataApi;
}