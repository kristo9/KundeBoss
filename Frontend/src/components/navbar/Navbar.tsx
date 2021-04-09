// Liberaries
import { Link } from 'react-router-dom';
import { useIsAuthenticated, useMsal } from '@azure/msal-react';
import { useAccount } from '@azure/msal-react';

// Components
import { SignInSignOutButton } from '../basicComp/SignInOutButton';
import { msalInstance } from '../../index';

// CSS style
import './Navbar.css';

const Authenticated = () => {
  const accounts = msalInstance.getAllAccounts();
  sessionStorage.setItem('UserName', accounts[0].username);
  console.log('UserName is set at sessionStorage "UserName":  ' + sessionStorage.getItem('UserName'));

  return (
    <div className='topnav'>
      <div className='left'>
        <Link to='/' className='Logo'>
          "Logo"
        </Link>
      </div>
      <div className='right'>
        <Link to='/contact' className='Link'>
          Contact
        </Link>
        <Link to='/help' className='Link'>
          Help
        </Link>
        <Link to='/about' className='Link'>
          About
        </Link>
        <SignInSignOutButton />
      </div>
    </div>
  );
};

const Unauthenticated = () => {
  sessionStorage.removeItem('UserName');
  console.log('UserName is removed as no account is signed in');

  return (
    <div className='topnav'>
      <div className='left'>
        <Link to='/' className='Logo'>
          "Logo"
        </Link>
      </div>
      <div className='right'>
        <Link to='/contact' className='Link'>
          Contact
        </Link>
        <Link to='/help' className='Link'>
          Help
        </Link>
        <Link to='/about' className='Link'>
          About
        </Link>
        <SignInSignOutButton />
      </div>
    </div>
  );
};

const Navbar = () => {
  const isAuthenticated = useIsAuthenticated();

  console.log('Bruker er authentisert:  ' + isAuthenticated);

  const { accounts } = useMsal();
  const account = useAccount(accounts[0] || {});
  msalInstance.setActiveAccount(account);
  console.log(msalInstance.getActiveAccount());
  console.log(sessionStorage.getItem('UserName'));

  return <div>{isAuthenticated ? <Authenticated /> : <Unauthenticated />}</div>;
};

export default Navbar;
