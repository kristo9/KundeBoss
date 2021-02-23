// Create the main myMSALObj instance
// configuration parameters are located at authConfig.js
import { PublicClientApplication, InteractionRequiredAuthError } from "@azure/msal-browser";

const authConfig = require("./authConfig");

const myMSALObj = new PublicClientApplication(authConfig.msalConfig);

let username = "";

const ui = require("./ui");

const api = require("./api");

const apiConfig = require("./apiConfig")


function selectAccount() {

    /**
     * See here for more info on account retrieval: 
     * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-common/docs/Accounts.md
     */

    const currentAccounts = myMSALObj.getAllAccounts();

    if (!currentAccounts || currentAccounts.length < 1) {
        return;
    } else if (currentAccounts.length > 1) {
        // Add your account choosing logic here
        console.warn("Multiple accounts detected.");
    } else if (currentAccounts.length === 1) {
        username = currentAccounts[0].username;
        ui.welcomeUser(username);
    }
}

function handleResponse(response) {
    console.log(response);


    /**
     * To see the full list of response object properties, visit:
     * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-browser/docs/request-response-object.md#response
     */

    if (response !== null) {
        username = response.account.username;
        //ui.welcomeUser(username);
    } else {
        selectAccount();
    }
}

export function signIn() {

    /**
     * You can pass a custom request object below. This will override the initial configuration. For more information, visit:
     * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-browser/docs/request-response-object.md#request
     */

    myMSALObj.loginPopup(authConfig.loginRequest)
        .then(handleResponse)
        .catch(error => {
            console.error(error);
        });
}

function signOut() {

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

function getTokenPopup(request) {

    /**
    * See here for more information on account retrieval: 
    * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-common/docs/Accounts.md
    */

    request.account = myMSALObj.getAccountByUsername(username);

    return myMSALObj.acquireTokenSilent(request)
        .catch(error => {
            console.warn(error);
            console.warn("silent token acquisition fails. acquiring token using popup");
            if (error instanceof InteractionRequiredAuthError) {
                // fallback to interaction when silent call fails
                return myMSALObj.acquireTokenPopup(request)
                    .then(response => {
                        console.log(response);
                        return response;
                    }).catch(error => {
                        console.error(error);
                    });
            } else {
                console.warn(error);
            }
        });
}

function passTokenToApi() {
    getTokenPopup(authConfig.tokenRequest)
        .then(response => {
            if (response) {
                console.log("access_token acquired at: " + new Date().toString());
                try {
                    api.callApi(apiConfig.apiConfig.uri, response.accessToken);
                } catch (error) {
                    console.warn(error);
                }
            }
        });
}

export default ui;