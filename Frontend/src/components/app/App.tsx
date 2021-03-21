// Libaries
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { MsalProvider, useMsal } from "@azure/msal-react";


// Components
import Navbar from '../navbar/Navbar';
import StartPage from '../pages/startpage/Startpage';
import Contact from '../pages/contact/Contact';
import Help from '../pages/help/Help';
import About from '../pages/about/About';
import Dashboard from '../pages/dashboard/Dashboard';
import CustomerPage from '../pages/customerpage/customerpage';
import PageNotFound from '../pages/pageNotFound/pageNotFound';
import AdminPage from '../pages/adminPages/adminPage';

// CSS Styling
import './App.css';

const Routes = () => {
  return (
    <Switch className='Component'>
      <Route path='/' exact component={StartPage} />
      <Route path='/contact' component={Contact} />
      <Route path='/help' component={Help} />
      <Route path='/about' component={About} />
      <Route path='/dashboard' component={Dashboard} />
      <Route path='/customerpage' component={CustomerPage} />
      <Route path='/admin' component={AdminPage} />
      <Route path='*' exact={true} component={PageNotFound} />
    </Switch>
  );
};

const App = ({ pca }) => {
  const { inProgress } = useMsal();

  console.log(inProgress);
  return (
    <Router>
      <MsalProvider instance={pca}>
        {(inProgress === 'login') ? 
        <div>
          <h6> Loading Login.........</h6>
        </div>
        :
        <div className='app' style={{ height: '100vh' }}>
          <Navbar />
          <div style={{ marginTop: '23px', width: '100%' }}>
            <Routes />
          </div>
        </div>
        }
      </MsalProvider>
    </Router>
  );
};

export default App;
