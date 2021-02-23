import './App.css';
import Navbar from '../navbar/Navbar';
import StartPage from '../pages/startpage/Startpage';
import Contact from '../pages/contact/Contact';
import Help from '../pages/help/Help';
import About from '../pages/about/About';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";


function App() {

  return (
      <Router>
        <div className="app">
          <div className="Navbar">
            <Navbar />
          </div>
          <div>
            <Switch className="Component">
                <Route path="/" exact component={StartPage} />
                <Route path="/contact" component={Contact} />
                <Route path="/help" component={Help} />
                <Route path="/about" component={About} />
            </Switch>
          </div>
        </div>
      </Router>
  );
}

export default App;
