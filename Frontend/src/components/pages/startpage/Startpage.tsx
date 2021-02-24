import "./Startpage.css";
import { signIn } from "../../../azure/authPopup"; // For popup
import { Link } from "react-router-dom";

function Startpage() {
  return (
    <div className="App">
      <div className="page">
        <h1 style={{fontSize: 100}}>Velkommen</h1>
      </div>
      <div className="loginDiv">
        <button className="login" onClick={signIn}>
          Log in
        </button>
        <div className="loginText">
          Ikke tilgang? &nbsp;
          <Link to='/contact'>
            <u>Kontakt oss</u>
          </Link>
        </div>
        <Link to='/dashboard'>
          <u>Dashboard</u>
        </Link>
      </div>
    </div>
  );
}

export default Startpage;
