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

/* This component returns either a authenticated or a unauthenticated navbar. The msal provider in the 
      App.tsx file keeps track of the user and if the user is signed in or not*/ 



const Navbar = () => {
  const { accounts } = useMsal();                       // Gets all accounts.
  const account = useAccount(accounts[0] || {});        // Gets first account.
  msalInstance.setActiveAccount(account);               // Sets first account as active account. 
  const isAuthenticated = useIsAuthenticated();         // Function from @azure/msal-react to keep track of authentication.
      
  return <div>{isAuthenticated ? <Authenticated /> : <Unauthenticated />}</div>;
  };
      
export default Navbar;                                  // Exports Navbar function as component.


const Authenticated = () => {

  const { userType } = useContext(TypeContext);             // Gets global userType from typeContext.
  const [showLink, setShowLink] = useState(false);          // Local state to keep track of whether to 

  const accounts = msalInstance.getAllAccounts();           // Gets all active accounts.
  sessionStorage.setItem('UserName', accounts[0].username); // Stores username as sessionstorage. 

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

  const { dictionary } = useContext(LanguageContext);       // Global language context through dictionary.
  const [showLink, setShowLink] = useState(false);          // Local state to keep track of whether 
  sessionStorage.removeItem('UserName');                    // If no user is signed in, makes sure sessionStorage is empty. 
  
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
      <div className='hamburgermenu coloredNavButton'>              {/* If navbar gets small enough it will show a hamburgermenu*/}
        <div onClick={() => setShowLink(!showLink)}>                {/* On click => set show link to the opposite of what it was*/}
        { showLink ?                                                /* Showlink is true? Then the links is showing. Else click them menu to open it.*/
          <img src={close} alt='Close' className='Open' /> :
          <img src={hamburgermeny} alt='Open' className='Open' />
        }
        </div>
      </div>
    </header>
  );
};


