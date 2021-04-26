import { InteractionRequiredAuthError, PublicClientApplication } from '@azure/msal-browser';
import { msalConfig } from './authConfig';

export const msalInstance = new PublicClientApplication(msalConfig);

export function getTokenRedirect(request): Promise<any> {
  /**
   * See here for more info on account retrieval:
   * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-common/docs/Accounts.md
   */

  const name = sessionStorage.getItem('UserName');
  request.account = msalInstance.getAccountByUsername(name);

  return msalInstance.acquireTokenSilent(request).catch((error) => {
    console.error(error);
    console.warn('silent token acquisition fails. acquiring token using redirect');
    if (error instanceof InteractionRequiredAuthError) {
      // Callback to interaction when silent call fails
      return msalInstance
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
