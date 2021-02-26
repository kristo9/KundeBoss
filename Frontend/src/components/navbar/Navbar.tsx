import React, { useState } from 'react';
import './Navbar.css';
import { AccountInfo } from "@azure/msal-browser";
import { Link } from "react-router-dom";


//import { signIn, signOut, authenticated } from "../../azure/authPopup"; // For popup
import { signIn } from "../../azure/authRedirect"; // For redirect


/*function AuthText(){ //Funker ikke
  const [txt, setAuthText] = useState("Login");

  if(txt === "Login"){
    return (
      <button onClick={() => setAuthText("Logout")}>{txt}</button>
    )
  }else{
    return (
      <button onClick={() => setAuthText("Login")}>{txt}</button>
    )
  }
}*/

/**
 * @returns a react component of the navbar 
 */
function Navbar() {

  /* if (authenticated){ // Set auth to say login
      console.log("Authenticated1")
    } else {            // Set auth to say logout
      console.log("Not authenticated1")
    }*/

    return (
      <div className="topnav">
        <div className="left">
          <Link to='/' className='Logo'>"Logo"</Link>
        </div>
        <div className="right">
          <Link to='/contact' className='Link'>Contact</Link>
          <Link to='/help' className='Link'>Help</Link>
          <Link to='/about' className='Link'>About</Link>
          <div>
            <button id="nt" className="Link" onClick={signIn} >Login</button>
          </div>
        </div>
      </div >
    );
}

export default Navbar;



  /*//current authenticated user
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
  };*/


  const AccInfo = ({ data }: any) => {
    return (
      <div>
        <pre>
          {JSON.stringify(data.idTokenClaims, null, 2)}
        </pre>
      </div>
    )
  }