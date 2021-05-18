// Libraries
import { useIsAuthenticated } from '@azure/msal-react';
import { msalInstance } from '../../../azure/authRedirect';

// Components
import HomePage from '../homepage/HomePage';
import { SignInSignOutButton } from '../../basicComp/SignInOutButton';

// CSS
import './Startpage.css';
import '../../basicComp/basic.css';

// Video
import Clouds from "../../../video/Clouds.mp4";


/* 
Startpage component is the first component a user gets sent to with the exact '/' url. If the user is authenticated he/her
    gets sent to homepage component. If the user is not authenticated, the welcomepage component will be shown where the 
    user gets a chance to log in.
*/ 

// WelcomePage for unauthenticated user. 
const WelcomePage = () => {
  return (
    <div className='Page'> 
    <div className="WelcomePage">
        <video playsInline autoPlay loop muted className="Video"> {/*Video flying through the sky.*/}
          <source src={Clouds} type="video/mp4"/>                 
        </video>
        <div className='overlay'></div>
        <div className='text'>
          <div className='text-box'>
            <h1> FLYT </h1>
            <SignInSignOutButton />                                {/*Imported button component.*/}
          </div>
        </div>
    </div>
    </div>
  );
};

const Startpage = () => {
  const isAuthenticated = useIsAuthenticated();                          // Checks user is authenticated through exciting func.
  return <div>{isAuthenticated ? <HomePage /> : <WelcomePage />}</div>;  // If user is authenticated => HomePage. If not WelcomePage. 
}

export default Startpage;   // Deafult export startpage function as component. 
