import { apiConfig } from './apiConfig';
/**
 * Configuration object to be passed to MSAL instance on creation.
 * For a full list of MSAL.js configuration parameters, visit:
 * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-browser/docs/configuration.md
 */
export const msalConfig = {
  auth: {
    clientId: 'c0907c6a-3b8f-4eb3-9345-5a1a1b5f6ea8',
    authority: 'https://login.microsoftonline.com/301091f0-e24f-43fa-bd87-59350cc3fbb6',
    redirectUri: 'http://localhost:3001'
    //redirectUri: 'https://kundebossblobstorage.z6.web.core.windows.net/',
  },
  cache: {
    cacheLocation: 'localStorage', // This configures where your cache will be stored
    storeAuthStateInCookie: false, // Set this to "true" if you are having issues on IE11 or Edge
  },
};

export const loginRequest = {
  scopes: ['openid', 'profile'],
};

/**
 * Scopes you add here will be used to request a token from Azure AD to be used for accessing a protected resource.
 * To learn more about how to work with scopes and resources, see:
 * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-browser/docs/resources-and-scopes.md
 */
export const tokenRequest = {
  scopes: apiConfig.scopes,
};
