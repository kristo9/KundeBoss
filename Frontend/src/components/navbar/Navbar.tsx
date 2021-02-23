import React, { useState } from 'react';
import './Navbar.css';
import AzureAuthenticationButton from "../../azure/azure-authentication-component";
import { AccountInfo } from "@azure/msal-browser";
import { Link } from "react-router-dom";





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

  const AccInfo = ({ data }: any) =>{
    return(
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
            <div>
                <Link to='/' className='Logo'>"Logo"</Link>
            </div>
        </div>
        <div className="right">
            <div>
                <Link to='/contact' className='Link'>Contact</Link>
            </div>
            <div>
                <Link to='/help' className='Link'>Help</Link>
            </div>
            <div>
                <Link to='/about' className='Link'>About</Link>
            </div>
            <div className="login">
                <AzureAuthenticationButton onAuthenticated={onAuthenticated} />
                {currentUser && (
                    <div>
                        <AccInfo data={currentUser}/>
                    </div>
                    )
                }
            </div>
        </div>
    </div>
    );
}


export default Navbar;


