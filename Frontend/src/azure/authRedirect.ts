// Create the main myMSALObj instance
// configuration parameters are located at authConfig.js
import { PublicClientApplication, InteractionRequiredAuthError } from '@azure/msal-browser';
import { loginRequest, msalConfig, tokenRequest } from './authConfig';
import { setUsername, callLogin, logToken } from './api';

import { AuthContext, LogOut, LogIn } from '../Context';
import react, { useReducer } from 'react';

const myMSALObj = new PublicClientApplication(msalConfig);

let username = null;

let userInformation: Promise<any> = null;

myMSALObj
  .handleRedirectPromise()
  .then(HandleResponse)
  .then(() => (userInformation = callLogin()))
  .then(async () => console.log(await userInformation))
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

function HandleResponse(response) {
  logToken();

  /**
   * To see the full list of response object properties, visit:
   * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-browser/docs/request-response-object.md#response
   */

  if (response !== null) {
    username = response?.account?.username;
  } else {
    selectAccount();
  }
  if (username) {
    LogIn();
    setUsername(username);
    console.log(username);
  }
}

export function SignIn() {
  /**
   * You can pass a custom request object below. This will override the initial configuration. For more information, visit:
   * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-browser/docs/request-response-object.md#request
   */

  myMSALObj
    .loginRedirect(loginRequest)
    .then(() => (userInformation = callLogin()))
    .then((respone) => console.log(respone));
}

export const SignOut = () => {
  username = null;
  setUsername(username);
  /**
   * You can pass a custom request object below. This will override the initial configuration. For more information, visit:
   * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-browser/docs/request-response-object.md#request
   */

  // Choose which account to logout from by passing a username.
  const logoutRequest = {
    account: myMSALObj.getAccountByUsername(username),
  };

  myMSALObj.logout(logoutRequest);
  LogOut();
};

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
