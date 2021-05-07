// Liberaries
import { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { useIsAuthenticated, useMsal } from '@azure/msal-react';
import { useAccount } from '@azure/msal-react';

// Components
import { SignInSignOutButton } from '../basicComp/SignInOutButton';
import { msalInstance } from '../../azure/authRedirect';
import LanguageSelector from '../../Context/language/LangContext';

// Context
import { LanguageContext } from '../../Context/language/LangContext';
import { TypeContext } from '../../Context/UserType/UserTypeContext';

// Image
import logo from '../../bilder/logo-ferdig.png';

// CSS style
import './Navbar.css';
import '../basicComp/basic.css';

const Authenticated = () => {
  const { dictionary } = useContext(LanguageContext);
  const { userType } = useContext(TypeContext);
  const accounts = msalInstance.getAllAccounts();
  sessionStorage.setItem('UserName', accounts[0].username);
  console.log('UserName is set at sessionStorage "UserName":  ' + sessionStorage.getItem('UserName'));

  const [showLink, setShowLink] = useState(false);

  return (
    <header className='topnav add-padding'>
      <div className='left'>
        <Link to='/' onClick={() => (showLink ? setShowLink(false) : '')}>
          <img src={logo} alt='Logo' className='logo' />
        </Link>
      </div>
      <div className='contents' id={showLink ? 'hidden' : ''}>
        <Link to='/contact' className='Link' onClick={() => (showLink ? setShowLink(false) : '')}>
          {dictionary.contact}
        </Link>
        <Link to='/help' className='Link' onClick={() => (showLink ? setShowLink(false) : '')}>
          {dictionary.help}
        </Link>
        <Link to='/about' className='Link' onClick={() => (showLink ? setShowLink(false) : '')}>
          {dictionary.about}
        </Link>
        <div className='coloredNavButton'>
          <SignInSignOutButton />
        </div>
      </div>
      <div className='hamburgermenu coloredNavButton'>
        <button onClick={() => setShowLink(!showLink)}> Open </button>
      </div>
    </header>
  );
};

const Unauthenticated = () => {
  const { dictionary } = useContext(LanguageContext);
  sessionStorage.removeItem('UserName');
  console.log('UserName is removed as no account is signed in');

  const [showLink, setShowLink] = useState(false);

  console.log(showLink);
  return (
    <header className='topnav add-padding'>
      <div className='left'>
        <Link to='/' onClick={() => (showLink ? setShowLink(false) : '')}>
          <img src={logo} alt='Logo' className='logo' />
        </Link>
      </div>
      <div className='contents' id={showLink ? 'hidden' : ''}>
        <Link to='/contact' className='Link' onClick={() => (showLink ? setShowLink(false) : '')}>
          {dictionary.contact}
        </Link>
        <Link to='/about' className='Link' onClick={() => (showLink ? setShowLink(false) : '')}>
          {dictionary.about}
        </Link>
        <div className='coloredNavButton'>
          <SignInSignOutButton />
        </div>
        <div className='langSel'>
          <LanguageSelector />
        </div>
      </div>
      <div className='hamburgermenu coloredNavButton'>
        <button onClick={() => setShowLink(!showLink)}> Open </button>
      </div>
    </header>
  );
};

const Navbar = () => {
  const isAuthenticated = useIsAuthenticated();
  const { userType } = useContext(TypeContext);
  console.log('Bruker er authentisert:  ' + isAuthenticated);
  console.log('Brukertype: ' + userType);

  const { accounts } = useMsal();
  const account = useAccount(accounts[0] || {});
  msalInstance.setActiveAccount(account);
  console.log(msalInstance.getActiveAccount());
  console.log(sessionStorage.getItem('UserName'));

  return <div>{isAuthenticated ? <Authenticated /> : <Unauthenticated />}</div>;
};

export default Navbar;
