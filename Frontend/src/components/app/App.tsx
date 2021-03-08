// Libaries
import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

// Components
import Navbar from '../navbar/Navbar';
import StartPage from '../pages/startpage/Startpage';
import Contact from '../pages/contact/Contact';
import Help from '../pages/help/Help';
import About from '../pages/about/About';
import Dashboard from '../pages/dashboard/Dashboard';
import CustomerPage from '../pages/customerpage/customerpage';
import PageNotFound from '../pages/pageNotFound/pageNotFound';

// CSS Styling
import './App.css';

function App() {
  return (
    <Router>
      <div className='app' style={{ height: '100vh' }}>
        <Navbar />
        <div style={{ marginTop: '23px', width: '100%' }}>
          <Switch className='Component'>
            <Route path='/' exact component={StartPage} />
            <Route path='/contact' component={Contact} />
            <Route path='/help' component={Help} />
            <Route path='/about' component={About} />
            <Route path='/dashboard' component={Dashboard} />
            <Route path='/customerpage' component={CustomerPage} />
            <Route path='*' exact={true} component={PageNotFound} />
          </Switch>
        </div>
      </div>
    </Router>
  );
}

export default App;
