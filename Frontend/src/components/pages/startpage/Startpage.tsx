import './Startpage.css';
import { Link } from 'react-router-dom';
import '../../basicComp/basic.css';
import { useIsAuthenticated } from '@azure/msal-react';
import { msalInstance } from '../../..';
import HomePage from './HomePage';
import Clouds from "./Clouds.mp4";


/**
 * @returns A react component with the login page
 */
// Video by Pressmaster from Pexels

/*
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

<ReactPlayer
            className='react-player fixed-bottom'
            url= {Clouds}
            width='100%'
            height='100%'
            autoplay = {true}
            controls = {false}
        />
*/

const WelcomePage = () => {
  return (
    <div className="WelcomePage">
        <video autoPlay loop muted className="Video">
          <source src={Clouds} type="video/mp4"/>
        </video>
        <div className="text"> 
          <h2> Flyt </h2>
          <h3> Orden over kunder og bla bla bla </h3>
        </div>
    </div>
  );
};

/* const HomePage = () => {
  return (
    <div className='add-margins'>
      <div>
        <h6> HEI {sessionStorage.getItem('UserName')}</h6>
        <Link to='/dashboard'>
          <u>Dashboard</u>
        </Link>
      </div>
    </div>
  );
}; */


function Startpage() {
  const isAuthenticated = useIsAuthenticated();
  console.log(msalInstance.getAccountByUsername(localStorage.getItem('UserName')));

  return <div>{isAuthenticated ? <HomePage /> : <WelcomePage />}</div>;
}

export default Startpage;
