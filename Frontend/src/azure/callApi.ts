import { callApi } from "./api";
import { apiConfig } from "./apiConfig";
import { getTokenPopup } from "./authPopup";
import { tokenRequest } from "./authConfig";

function callApiLogin() {
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

/*
Redirect

function passTokenToApi() {
    getTokenRedirect(authConfig.tokenRequest)
        .then(response => {
            api.callApi(apiConfig.uri, response.accessToken);
        }).catch(error => {
            console.error(error);
        });
}
*/