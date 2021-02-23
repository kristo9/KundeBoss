import { apiConfig } from "./apiConfig";
import { getTokenPopup } from "./authPopup";
import { tokenRequest } from "./authConfig";

const ui = require("./ui");

export function callApi(endpoint, token) {
  console.log(endpoint, token)
  const headers = new Headers();
  const bearer = `Bearer ${token}`;

  headers.append("Authorization", bearer);

  const options = {
    method: "POST",
    headers: headers
  };

  ui.logMessage('Calling Web API...');

  fetch(endpoint, options)
    .then(response => response.json())
    .then(response => {

      console.log(response);

      if (response) {
        ui.logMessage('Web API responded: Hello ' + response['name'] + '!');
      }

      return response;
    }).catch(error => {
      console.error(error);
    });
}

export function callLogin() {
  getTokenPopup(tokenRequest)
    .then(response => {
      if (response) {
        console.log("access_token acquired at: " + new Date().toString());
        try {
          callApi(apiConfig.uri, response.accessToken);
        } catch (error) {
          console.warn(error);
        }
      }
    });
}
