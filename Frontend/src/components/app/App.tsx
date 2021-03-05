// Libaries 
import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

// Components
import Navbar from '../navbar/Navbar';
import StartPage from '../pages/startpage/Startpage';
import Contact from '../pages/contact/Contact';
import Help from '../pages/help/Help';
import About from '../pages/about/About';
import Dashboard from '../pages/dashboard/Dashboard'
import CustomerPage from '../pages/customerpage/customerpage';

// CSS Styling
import './App.css';

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
                <Route path="/dashboard" component={Dashboard} />
                <Route path="/customerpage/:id" exact component={CustomerPage} />
            </Switch>
          </div>
        </div>
      </Router>
  );
}

export default App;
