// Create the main myMSALObj instance
// configuration parameters are located at authConfig.js
import { PublicClientApplication, InteractionRequiredAuthError } from '@azure/msal-browser';
import { loginRequest, msalConfig } from './authConfig';
import { setUsername, callLogin } from './api';


const myMSALObj = new PublicClientApplication(msalConfig);

let username = null;

myMSALObj
  .handleRedirectPromise()
  .then(handleResponse)
  .then(callLogin)
  .catch((error) => {
    console.error(error);
  });

function selectAccount() {
  /**
   * See here for more information on account retrieval:
   * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-common/docs/Accounts.md
   */

  const currentAccounts = myMSALObj.getAllAccounts();

  if (!currentAccounts || currentAccounts.length < 1) {
    return;
  } else if (currentAccounts.length > 1) {
    // Add your account choosing logic here
    console.warn('Multiple accounts detected.');
  } else if (currentAccounts.length === 1) {
    username = currentAccounts[0].username;
  }
}

function handleResponse(response) {
  /**
   * To see the full list of response object properties, visit:
   * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-browser/docs/request-response-object.md#response
   */

  if (response !== null) {
    username = response.account.username;
  } else {
    selectAccount();
  }
  if (username) {
    setUsername(username);
    console.log(username);
  }
}

export function signIn() {
  /**
   * You can pass a custom request object below. This will override the initial configuration. For more information, visit:
   * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-browser/docs/request-response-object.md#request
   */

  myMSALObj.loginRedirect(loginRequest);
}

export function signOut() {
  username = null;
  setUsername(username);
  /**
   * You can pass a custom request object below. This will override the initial configuration. For more information, visit:
   * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-browser/docs/request-response-object.md#request
   */

  // Choose which account to logout from by passing a username.
  const logoutRequest = {
    account: myMSALObj.getAccountByUsername(username)
  };

  myMSALObj.logout(logoutRequest);
}

selectAccount();

export function getTokenRedirect(request): Promise<any> {
  /**
   * See here for more info on account retrieval:
   * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-common/docs/Accounts.md
   */

  request.account = myMSALObj.getAccountByUsername(username);

  return myMSALObj.acquireTokenSilent(request).catch((error) => {
    console.error(error);
    console.warn('silent token acquisition fails. acquiring token using redirect');
    if (error instanceof InteractionRequiredAuthError) {
      // fallback to interaction when silent call fails
      return myMSALObj
        .acquireTokenRedirect(request)
        .then((response) => {
          console.log(response);
          return response;
        })
        .catch((error) => {
          console.error(error);
        });
    } else {
      console.warn(error);
    }
  });
}

// Acquires and access token and then passes it to the API call
