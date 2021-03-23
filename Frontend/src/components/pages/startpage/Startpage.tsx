import './Startpage.css';
import { Link } from 'react-router-dom';
import '../../basicComp/basic.css';
import { useIsAuthenticated } from '@azure/msal-react';
import { msalInstance } from '../../..';
import HomePage from './HomePage';

/**
 * @returns A react component with the login page
 */

const WelcomePage = () => {
  return (
    <div className='add-margins'>
      <div className='page'>
        <h1 className='h1-style h1-color'>Velkommen Random!</h1>
      </div>
      <div className='loginDiv'>
        <div className='loginText'>
          Ikke tilgang? &nbsp;
          <Link to='/contact'>
            <u>Kontakt oss</u>
          </Link>
        </div>
      </div>
    </div>
  );
};

const HomePage = () => {
  return (
    <div className='add-margins'>
      <div>
        <h6> HEI {localStorage.getItem('UserName')}</h6>
        <Link to='/dashboard'>
          <u>Dashboard</u>
        </Link>
      </div>
    </div>
  );
};

function Startpage() {
  const isAuthenticated = useIsAuthenticated();
  console.log(msalInstance.getAccountByUsername(localStorage.getItem('UserName')));

  return <div>{isAuthenticated ? <HomePage /> : <WelcomePage />}</div>;
}

export default Startpage;
