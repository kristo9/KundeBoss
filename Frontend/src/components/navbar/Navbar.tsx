// Liberaries
import { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { useIsAuthenticated, useMsal } from '@azure/msal-react';
import { useAccount } from '@azure/msal-react';

// Components
import { SignInSignOutButton } from '../basicComp/SignInOutButton';
import { msalInstance } from '../../azure/authRedirect';
import LanguageSelector from '../../language/LangContext';

// Context
import { LanguageContext } from '../../language/LangContext';

// CSS style
import './Navbar.css';



const Authenticated = () => {
  const { dictionary } = useContext(LanguageContext);
  const accounts = msalInstance.getAllAccounts();
  sessionStorage.setItem('UserName', accounts[0].username);
  console.log('UserName is set at sessionStorage "UserName":  ' + sessionStorage.getItem('UserName'));

  const[showLink, setShowLink] = useState(false);

  return (
    <header className='topnav'>
      <div className='left'>
        <Link to='/' className='Logo' onClick={ () => showLink ? setShowLink(false) : ''}> "Logo" </Link>
      </div>
      <div className='right'>
        <div className='contents' id={ showLink ? 'hidden' : '' }>
          <div className='links'>
            <Link to='/contact' className='Link' onClick={ () => showLink ? setShowLink(false) : ''}> {dictionary.contact} </Link>
            <Link to='/help' className='Link' onClick={ () => showLink ? setShowLink(false) : ''}> {dictionary.help} </Link>
            <Link to='/about' className='Link' onClick={ () => showLink ? setShowLink(false) : ''}> {dictionary.about} </Link> 
          </div>
          <div className='signInOut'>
            <SignInSignOutButton />
          </div>
        </div>
        <div className='hamburgermenu'>
          <button onClick={ () => setShowLink(!showLink)}> Open </button>
        </div>
      </div>
    </header>
  );
};

/*

*/


const Unauthenticated = () => {
  const { dictionary } = useContext(LanguageContext);
  sessionStorage.removeItem('UserName');
  console.log('UserName is removed as no account is signed in');

  const[showLink, setShowLink] = useState(false);

  console.log(showLink);
  return (
    <header className='topnav'>
      <div className='left'>
        <Link to='/' className='Logo' onClick={ () => showLink ? setShowLink(false) : ''}> "Logo" </Link>
      </div>
      <div className='right'>
        <div className='contents' id={ showLink ? 'hidden' : '' }>
          <div className='links'>
            <Link to='/contact' className='Link' onClick={ () => showLink ? setShowLink(false) : ''}> {dictionary.contact} </Link>
            <Link to='/help' className='Link' onClick={ () => showLink ? setShowLink(false) : ''}> {dictionary.help} </Link>
            <Link to='/about' className='Link' onClick={ () => showLink ? setShowLink(false) : ''}> {dictionary.about} </Link> 
          </div>
          <div className='signInOut'>
            <SignInSignOutButton />
          </div>
        </div>
        <div className='hamburgermenu'>
          <button onClick={ () => setShowLink(!showLink)}> Open </button>
        </div>
      </div>
    </header>
  );
};

const Navba = () => {
  const isAuthenticated = useIsAuthenticated();

  console.log('Bruker er authentisert:  ' + isAuthenticated);

  const { accounts } = useMsal();
  const account = useAccount(accounts[0] || {});
  msalInstance.setActiveAccount(account);
  console.log(msalInstance.getActiveAccount());
  console.log(sessionStorage.getItem('UserName'));

  return <div>{isAuthenticated ? <Authenticated /> : <Unauthenticated />}</div>;
};

export default Navba;
