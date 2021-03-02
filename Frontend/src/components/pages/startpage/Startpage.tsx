import "./Startpage.css";
import { signIn } from "../../../azure/authRedirect"; // For popup
import { Link } from "react-router-dom";

/**
 * @returns A react component with the login page
 */
function Startpage() {
  return (
    <div>
      <div className="page">
        <h1 style={{ fontSize: 100 }}>Velkommen</h1>
      </div>
      <div className="loginDiv">
        <button className="login" onClick={signIn}>
          Log in
        </button>
        <div className="loginText">
          Ikke tilgang? &nbsp;
          <Link to="/contact">
            <u>Kontakt oss</u>
          </Link>
        </div>
        <Link to="/dashboard">
          <u>Dashboard</u>
        </Link>
      </div>
    </div>
  );
}

export default Startpage;
