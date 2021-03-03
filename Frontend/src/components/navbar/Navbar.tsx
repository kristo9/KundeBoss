// Liberaries
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import  updateAuth  from '../../redux/action/Actions'
import { signIn, signOut } from '../../azure/authRedirect';

// CSS style
import "./Navbar.css";


function Navbar(props) {
    console.log(props.islogged);
    return (
      <div className="topnav">
        <div className="left">
          <Link to='/' className='Logo'>"Logo"</Link>
        </div>
        <div className="right">
          <Link to='/contact' className='Link'>Contact</Link>
          <Link to='/help' className='Link'>Help</Link>
          <Link to='/about' className='Link'>About</Link>
          {(props.islogged !== 'AUTH') ?
            <div>
              <button id="nt" className="Link" onClick={signIn} >Log in</button>
            </div> : 
            <div>
              <button id="nt" className="Link" onClick={signOut} >Log Out</button>
            </div>}
            <button id="nt" className="Link" onClick={props.updateAuth}> Bytt Log </button>
        </div>
      </div>
    );
}

const mapStateToProps = state => {
  return state;
}

const mapDispatchToProps = dispatch => {
  return {
    updateAuth: () => {dispatch(updateAuth)}
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Navbar);


/**
 * @returns a react component of the navbar
 */

/*
const AccInfo = ({ data }: any) => {
  return (
    <div>
      <pre>{JSON.stringify(data.idTokenClaims, null, 2)}</pre>
    </div>
  );
}; */
/*//current authenticated user
const [currentUser, setCurrentUser] = useState<AccountInfo>();

//authentication callback
const onAuthenticated = async (userAccountInfo: AccountInfo) => {
  setCurrentUser(userAccountInfo);
};

/* Render JSON data in readable format
const PrettyPrintJson = ({ data }: any) => {
  return (
    <div>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
};

  /* if (authenticated){ // Set auth to say login
      console.log("Authenticated1")
    } else {            // Set auth to say logout
      console.log("Not authenticated1")
    }*/

    //const logged = isLogedIn();

    //const loggedIn = useSelector(state => state.islogged);

    //import { signIn, signOut, authenticated } from "../../azure/authPopup"; // For popup
// For redirect

/*function AuthText(){ //Funker ikke
  const [txt, setAuthText] = useState("Login");

  if(txt === "Login"){
    return (
      <button onClick={() => setAuthText("Logout")}>{txt}</button>
    )
  }else{
    return (
      <button onClick={() => setAuthText("Login")}>{txt}</button>
    )
  }
}*/

