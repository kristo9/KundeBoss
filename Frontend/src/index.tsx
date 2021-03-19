// Libaries
import React from 'react';
import ReactDOM from 'react-dom';
import reportWebVitals from './reportWebVitals';
import { PublicClientApplication, EventType } from "@azure/msal-browser";
import { msalConfig } from "./azure/authConfig";

// Component
import App from './components/app/App';

// CSS Style
import './index.css';

export const msalInstance = new PublicClientApplication(msalConfig);

const accounts = msalInstance.getAllAccounts();
if (accounts.length > 0) {
  msalInstance.setActiveAccount(accounts[0]);
  localStorage.setItem("UserName", accounts[0].username)
  console.log(localStorage.getItem("UserName"))
}

msalInstance.addEventCallback((event) => {
    if (event.eventType === EventType.LOGIN_SUCCESS && event.payload.account) {
      const account = event.payload.account;
      msalInstance.setActiveAccount(account);
    }
  });

ReactDOM.render(
    <React.StrictMode>
        <App pca={msalInstance}/>
    </React.StrictMode>,
    document.getElementById('root')
);

reportWebVitals();
