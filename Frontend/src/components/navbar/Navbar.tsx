import React, { useState } from 'react';
import './Navbar.css';
import { AccountInfo } from "@azure/msal-browser";
import { Link } from "react-router-dom";




import { signIn } from "../../azure/authPopup"; // For popup
//import { signIn } from "../../azure/authRedirect"; // For redirect




function Navbar() {

  //current authenticated user
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




  return (
    <div className="topnav">
      <div className="left">
        <Link to='/' className='Logo'>"Logo"</Link>
      </div>
      <div className="right">
        <Link to='/contact' className='Link'>Contact</Link>
        <Link to='/help' className='Link'>Help</Link>
        <Link to='/about' className='Link'>About</Link>
        <button className="Link" onClick={signIn} >Login</button>
      </div>
    </div >
  );
}


export default Navbar;


