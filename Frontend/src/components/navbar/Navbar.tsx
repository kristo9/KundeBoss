import React, { useState } from 'react';
import './Navbar.css';
import AzureAuthenticationButton from "../../azure/azure-authentication-component";
import { AccountInfo } from "@azure/msal-browser";



function Navbar() {

  // current authenticated user
  //const [currentUser, setCurrentUser] = useState<AccountInfo>();

  // authentication callback
  //const onAuthenticated = async (userAccountInfo: AccountInfo) => {
  //  setCurrentUser(userAccountInfo);
  //};

  // Render JSON data in readable format
  //const PrettyPrintJson = ({ data }: any) => {
  //  return (
  //    <div>
  //      <pre>{JSON.stringify(data, null, 2)}</pre>
  //    </div>
  //  );
  //};

  //const AccInfo = ({ data }: any) =>{
  //  return(
  //   <div>
  //    <pre>
  //     {JSON.stringify(data.idTokenClaims, null, 2)}
  //  </pre>
  //    </div>
  //  )
  //}

return (
    <div className="topnav">
        <div className="left">
            <a className="active" href="#home">"Logo"</a>
        </div>
        <div className="right">
            <a href="#contact">Contact</a>
            <a href="#help">Help</a>
            <a href="#about">About</a>
            <a  className="App-link" href="https://timiansfuncapp.azurewebsites.net/.auth/login/aad/callback" target="_blank" rel="noopener noreferrer">
                Log In
            </a>
        </div>
    </div>
    );
}


export default Navbar;

/*
<AzureAuthenticationButton onAuthenticated={onAuthenticated} />
            {currentUser && (
                <div>
                    <AccInfo data={currentUser}/>
                </div>
                )
            }*/