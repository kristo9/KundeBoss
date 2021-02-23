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