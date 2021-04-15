// Liberaries
import { Link } from 'react-router-dom';
import { useIsAuthenticated, useMsal } from '@azure/msal-react';
import { useAccount } from '@azure/msal-react';

// Components
import { SignInSignOutButton } from '../basicComp/SignInOutButton';
import { msalInstance } from '../../index';
import LanguageSelector from '../../language/LangContext';

// Context
import { LanguageContext } from '../../language/LangContext';

// CSS style
import './Navbar.css';
import { useContext } from 'react';


const Authenticated = () => {
  const { dictionary } = useContext(LanguageContext);
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
          {dictionary.contact}
        </Link>
        <Link to='/help' className='Link'>
          {dictionary.help}
        </Link>
        <Link to='/about' className='Link'>
          {dictionary.about}
        </Link>
        <SignInSignOutButton />
        <LanguageSelector />
      </div>
    </div>
  );
};

/*

*/


const Unauthenticated = () => {
  const { dictionary } = useContext(LanguageContext);
  sessionStorage.removeItem('UserName');
  console.log('UserName is removed as no account is signed in');

  return (
    <header className='topnav'>
    <div className='left'>
      <Link to='/' className='Logo'>
        "Logo"
      </Link>
    </div>
    <div className='right'>
      <Link to='/contact' className='Link'>
        {dictionary.contact}
      </Link>
      <Link to='/help' className='Link'>
        {dictionary.help}
      </Link>
      <Link to='/about' className='Link'>
        {dictionary.about}
      </Link>
      <SignInSignOutButton />
      <LanguageSelector />
    </div>
    </header>
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
