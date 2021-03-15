// Liberaries
import { useContext, useReducer } from 'react';
import { Link } from 'react-router-dom';
import { SignIn, SignOut } from '../../azure/authRedirect';

import { AuthContext, Toggle, AuthenticationReducer, AuthContextProvider } from "../../Context";

// CSS style
import './Navbar.css';



const Authenticated = () => {
  const [state, dispatch] = useReducer(AuthenticationReducer, AuthContext)
  return (
    <div className='topnav'>
      <div className='left'>
        <Link to='/' className='Logo'> "Logo" </Link>
      </div>
      <div className='right'>
        <Link to='/contact' className='Link'> Contact </Link>
        <Link to='/help' className='Link'> Help </Link>
        <Link to='/about' className='Link'> About </Link>
        <button id='nt' className='Link' onClick={SignOut}> Log Out </button>
        <button id='nt' className='Link' onClick={() => {dispatch('LOGOUT')}}> Toggle Igjen </button>
    </div>
    </div>
  )
}

const Unauthenticated = () => {
  const [state, dispatch] = useReducer(AuthenticationReducer, AuthContext)
  return (
      <div className='topnav'>
        <div className='left'>
          <Link to='/' className='Logo'> "Logo" </Link>
        </div>
        <div className='right'>
          <Link to='/contact' className='Link'> Contact </Link>
          <Link to='/help' className='Link'> Help </Link>
          <Link to='/about' className='Link'> About </Link>
          <button id='nt' className='Link' onClick={SignIn}> Log In </button>
          <button id='nt' className='Link' onClick={() => {dispatch({type: 'LOGIN_AUTHENTICATION'})}}> Toggle </button>
        </div>
      </div>
  )
}

const Navbar = () => {
  
  const { isAuthenticated } = useContext(AuthContext);
  console.log(isAuthenticated);
  return (
    <AuthContextProvider>
      <div>
        {(isAuthenticated) ? <Authenticated/> : <Unauthenticated/>}
      </div>
    </AuthContextProvider>
  );
}

export default Navbar;