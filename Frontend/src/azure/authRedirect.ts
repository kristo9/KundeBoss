// Create the main myMSALObj instance
// configuration parameters are located at authConfig.js
import { PublicClientApplication, InteractionRequiredAuthError } from "@azure/msal-browser";
import { welcomeUser } from "./ui";
import { loginRequest, msalConfig, tokenRequest } from "./authConfig";
import { apiConfig } from "./apiConfig";
import { callApi } from "./api";

const myMSALObj = new PublicClientApplication(msalConfig);

let username = "";


myMSALObj.handleRedirectPromise()
    .then(handleResponse)
    .catch(error => {
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
        console.warn("Multiple accounts detected.");
    } else if (currentAccounts.length === 1) {
        username = currentAccounts[0].username;
        welcomeUser(username);
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
        welcomeUser(username);
    } else {
        selectAccount();
    }
}

export function signIn() {

    /**
     * You can pass a custom request object below. This will override the initial configuration. For more information, visit:
     * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-browser/docs/request-response-object.md#request
     */

    myMSALObj.loginRedirect(loginRequest)
        .then(passTokenToApi);
}

export function signOut() {

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

function getTokenRedirect(request): Promise<any> {

    /**
    * See here for more info on account retrieval: 
    * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-common/docs/Accounts.md
    */

    request.account = myMSALObj.getAccountByUsername(username);

    return myMSALObj.acquireTokenSilent(request)
        .catch(error => {
            console.error(error);
            console.warn("silent token acquisition fails. acquiring token using popup");
            if (error instanceof InteractionRequiredAuthError) {
                // fallback to interaction when silent call fails
                return myMSALObj.acquireTokenRedirect(request);
            } else {
                console.error(error);
            }
        });
}

function passTokenToApi() {
    getTokenRedirect(tokenRequest)
        .then(response => {
            callApi(apiConfig.uri, response.accessToken, {});
        }).catch(error => {
            console.error(error);
        });
}
// Acquires and access token and then passes it to the API call
