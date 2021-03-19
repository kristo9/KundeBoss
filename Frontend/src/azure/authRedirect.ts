import { InteractionRequiredAuthError, PublicClientApplication } from "@azure/msal-browser";
import { msalConfig } from "./authConfig";

const myMSALObj = new PublicClientApplication(msalConfig);


export function getTokenRedirect(request): Promise<any> {
  /**
   * See here for more info on account retrieval:
   * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-common/docs/Accounts.md
   */

  const name = localStorage.getItem("UserName");
  request.account = myMSALObj.getAccountByUsername(name);

  return myMSALObj.acquireTokenSilent(request).catch((error) => {
    console.error(error);
    console.warn('silent token acquisition fails. acquiring token using redirect');
    if (error instanceof InteractionRequiredAuthError) {
      // Fallback to interaction when silent call fails
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