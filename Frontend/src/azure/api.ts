import { apiConfig } from "./apiConfig";
import { getTokenPopup } from "./authPopup";
import { tokenRequest } from "./authConfig";

const ui = require("./ui");

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

export async function callLogin() {
  let retDataApi = null;
  await getTokenPopup(tokenRequest)
    .then(response => {
      if (response) {
        console.log("access_token acquired at: " + new Date().toString());
        try {
          retDataApi = callApi(apiConfig.uri + "LoginTrigger", response.accessToken, {});
        } catch (error) {
          console.warn(error);
        }
      }
    });

  console.log(retDataApi);
  return retDataApi;
}
