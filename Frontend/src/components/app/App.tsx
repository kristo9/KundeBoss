import "./App.css";
import Navbar from "../navbar/Navbar";
import StartPage from "../pages/startpage/Startpage";
import Contact from "../pages/contact/Contact";
import Help from "../pages/help/Help";
import About from "../pages/about/About";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import PageNotFound from "../pages/pageNotFound/pageNotFound";
import Dashboard from "../pages/dashboard/Dashboard";
import Customerpage from "../pages/customerpage/customerpage";

/**
 * @returns HTML for the entire website
 */
function App() {
  return (
    <Router>
      <div className="app" style={{ height: "100vh" }}>
        <Navbar />
        <div style={{ marginTop: "23px", width: "100%" }}>
          <Switch className="Component">
            <Route path="/" exact component={StartPage} />
            <Route path="/contact" component={Contact} />
            <Route path="/help" component={Help} />
            <Route path="/about" component={About} />
            <Route path="/dashboard" component={Dashboard} />
            <Route path="/customerpage" component={Customerpage} />
            <Route path="*" exact={true} component={PageNotFound} />
          </Switch>
        </div>
      </div>
    </Router>
  );
}

export default App;
