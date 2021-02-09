import { Configuration, LogLevel } from "@azure/msal-browser";

const AzureActiveDirectoryAppClientId: any =
  process.env.REACT_APP_AZURE_ACTIVE_DIRECTORY_APP_CLIENT_ID;

export const MSAL_CONFIG: Configuration = {
  auth: {
    clientId: AzureActiveDirectoryAppClientId,
    authority: "https://login.microsoftonline.com/301091f0-e24f-43fa-bd87-59350cc3fbb6",
  },
  cache: {
    cacheLocation: "sessionStorage",
    storeAuthStateInCookie: false,
  },
  system: {
    loggerOptions: {
      loggerCallback: (level, message, containsPii) => {
        if (containsPii) {
          return;
        }
        switch (level) {
          case LogLevel.Error:
            console.error(message);
            return;
          case LogLevel.Info:
            console.info(message);
            return;
          case LogLevel.Verbose:
            console.debug(message);
            return;
          case LogLevel.Warning:
            console.warn(message);
            return;
        }
      },
    },
  },
};