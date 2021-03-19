// Liberaries
import { Link } from 'react-router-dom';
import { useIsAuthenticated, useMsal } from "@azure/msal-react";

// CSS style
import './Navbar.css';
import { PublicClientApplication } from '@azure/msal-browser';
import { msalConfig } from '../../azure/authConfig';
import { useAccount } from "@azure/msal-react";

// Components
import { SignInSignOutButton } from '../basicComp/SignInOutButton'



const Authenticated = () => {

  return (
    <div className='topnav'>
      <div className='left'>
        <Link to='/' className='Logo'> "Logo" </Link>
      </div>
      <div className='right'>
        <Link to='/contact' className='Link'> Contact </Link>
        <Link to='/help' className='Link'> Help </Link>
        <Link to='/about' className='Link'> About </Link>
        <SignInSignOutButton />
    </div>
    </div>
  )
}

const Unauthenticated = () => {

  return (
      <div className='topnav'>
        <div className='left'>
          <Link to='/' className='Logo'> "Logo" </Link>
        </div>
        <div className='right'>
          <Link to='/contact' className='Link'> Contact </Link>
          <Link to='/help' className='Link'> Help </Link>
          <Link to='/about' className='Link'> About </Link>
          <SignInSignOutButton />
        </div>
      </div>
  )
}

const Navbar = () => {
  const isAuthenticated = useIsAuthenticated();

  console.log("Bruker er authentisert:  " + isAuthenticated);


  const msalInstance = new PublicClientApplication(msalConfig);
  const { accounts } = useMsal();
  const account = useAccount(accounts[0] || {});
  msalInstance.setActiveAccount(account);
  console.log(msalInstance.getActiveAccount())
  console.log(localStorage.getItem("UserName"))

  return (
      <div>
        {(isAuthenticated) ? <Authenticated/> : <Unauthenticated/>}
      </div>
  );
}

export default Navbar;