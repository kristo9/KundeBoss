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
import hamburgermeny from '../../bilder/Hamburger_icon.svg.png'
import close from '../../bilder/close.png'

// CSS style
import './Navbar.css';
import '../basicComp/basic.css';

const Authenticated = () => {
  const { userType } = useContext(TypeContext);
  const accounts = msalInstance.getAllAccounts();
  sessionStorage.setItem('UserName', accounts[0].username);
  const [showLink, setShowLink] = useState(false);

  return (
    <header className='topnav add-padding'>
      <div className='left'>
        <Link to='/' onClick={() => (showLink ? setShowLink(false) : '')}>
          <img src={logo} alt='Logo' className='logo' />
        </Link>
      </div>
      <div className='contents' id={showLink ? 'hidden' : ''}>
        { (userType === 'AdminReadFirst' || userType === 'AdminReadNotFirst' || userType === 'AdminWriteFirst' || userType === 'AdminWriteNotFirst') ?
        <Link to='/admin' className='Link' onClick={() => (showLink ? setShowLink(false) : '')}>
          Admin
        </Link> : ''
        }
        <div className='coloredNavButton'>
          <SignInSignOutButton />
        </div>
        <div className='langSel'>
          <LanguageSelector />
        </div>
      </div>
      <div className='hamburgermenu'>
        { (userType === 'AdminReadFirst' || userType === 'AdminReadNotFirst' || userType === 'AdminWriteFirst' || userType === 'AdminWriteNotFirst') ?
        <Link to='/admin' className='Link' onClick={() => (showLink ? setShowLink(false) : '')}>
          Admin
        </Link> : ''
        }
        <div className='coloredNavButton'>
          <SignInSignOutButton />
        </div>
        <div className='langSel'>
          <LanguageSelector />
        </div>
      </div>
    </header>
  );
};

const Unauthenticated = () => {
  const { dictionary } = useContext(LanguageContext);
  sessionStorage.removeItem('UserName');
  //console.log('UserName is removed as no account is signed in');

  const [showLink, setShowLink] = useState(false);

  //console.log(showLink);
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
        <div onClick={() => setShowLink(!showLink)}> 
        { showLink ? 
          <img src={close} alt='Close' className='Open' /> :
          <img src={hamburgermeny} alt='Open' className='Open' />
      }
        </div>
      </div>
    </header>
  );
};

const Navbar = () => {
  const isAuthenticated = useIsAuthenticated();
  
  const { accounts } = useMsal();
  const account = useAccount(accounts[0] || {});
  msalInstance.setActiveAccount(account);

  return <div>{isAuthenticated ? <Authenticated /> : <Unauthenticated />}</div>;
};

export default Navbar;
