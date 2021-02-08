import React from 'react';
import logo from './logo.svg';
import './App.css';
import { useState } from "react";
import AzureAuthenticationButton from "./azure/azure-authentication-component";
import { AccountInfo } from "@azure/msal-browser";


function App() {

  
  // current authenticated user
  const [currentUser, setCurrentUser] = useState<AccountInfo>();

  // authentication callback
  const onAuthenticated = async (userAccountInfo: AccountInfo) => {
    setCurrentUser(userAccountInfo);
  };

  // Render JSON data in readable format
  const PrettyPrintJson = ({ data }: any) => {
    return (
      <div>
        <pre>{JSON.stringify(data, null, 2)}</pre>
      </div>
    );
  };


  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Funker det nå?
        </p>
        <a
          className="App-link"
          href="https://timiansfuncapp.azurewebsites.net/.auth/login/aad/callback"
          target="_blank"
          rel="noopener noreferrer"
        >
          Log In
        </a>
        <AzureAuthenticationButton onAuthenticated={onAuthenticated} />
      {currentUser && (
        <div>
          <PrettyPrintJson data={currentUser} />
        </div>
      )}
      </header>
    </div>
  );
}

export default App;
