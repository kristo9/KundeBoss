// Libaries
import React from 'react';
import ReactDOM from 'react-dom';
import reportWebVitals from './reportWebVitals';
import { msalInstance } from './azure/authRedirect';

// Component
import App from './components/app/App';

// Creating a new msalInstanse for keeping track of Authentification.
//export const msalInstance = new PublicClientApplication(msalConfig);

// Assigning the active account to ".activeAccount" if account is signed in.
const accounts = msalInstance.getAllAccounts();
if (accounts.length > 0) {
  msalInstance.setActiveAccount(accounts[0]);
}
// Sending instance of msal as prop to App component.
ReactDOM.render(
  <React.StrictMode>
    <App pca={msalInstance}/>
  </React.StrictMode>,
  document.getElementById('root')
);

reportWebVitals();
