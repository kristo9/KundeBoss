import React, { useState } from 'react';
import './Navbar.css';
import AzureAuthenticationButton from "../../azure/azure-authentication-component";
import { AccountInfo } from "@azure/msal-browser";
import { Link, Route, Switch } from "react-router-dom";

const authRedirect = require("../../azure/authRedirect");

const authPopup = require("../../azure/authPopup");



function Navbar() {

  /* //current authenticated user
   const [currentUser, setCurrentUser] = useState<AccountInfo>();
 
   //authentication callback
   const onAuthenticated = async (userAccountInfo: AccountInfo) => {
     setCurrentUser(userAccountInfo);
   };
 
   /* Render JSON data in readable format
   const PrettyPrintJson = ({ data }: any) => {
     return (
       <div>
         <pre>{JSON.stringify(data, null, 2)}</pre>
         </div>
     );
   };
 
   const AccInfo = ({ data }: any) => {
     return (
       <div>
         <pre>
           {JSON.stringify(data.idTokenClaims, null, 2)}
         </pre>
       </div>
     )
   }*/

  const Home = () => (
    <div>
      <h2>Home</h2>
    </div>
  );

  const Contact = () => (
    <div>
      <h2>Contact</h2>
    </div>
  );

  const Help = () => (
    <div>
      <h2>Help</h2>
    </div>
  );

  const About = () => (
    <div>
      <h2>About</h2>
    </div>
  );




  return (
    <div className="topnav">
      <div className="left">
        <li>
          <Link to="/" className='Link'>"Logo"</Link>
        </li>
      </div>
      <div className="right">
        <li>
          <Link to="/contact" className='Link'>Contact</Link>
        </li>
        <li>
          <Link to="/help" className='Link'>Help</Link>
        </li>
        <li>
          <Link to="/about" className='Link'>About</Link>
        </li>

        <button className="Link" onClick={authRedirect.signIn} >Login</button>

      </div>
      <Route exatct path="/"><Home /></Route>
      <Route path="/contact"><Contact /></Route>
      <Route path="/help"><Help /></Route>
      <Route path="/about"><About /></Route>
    </div>
  );
}


export default Navbar;


