// Libaries
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { MsalProvider, useMsal } from '@azure/msal-react';

// Components
import Navba from '../navbar/Navbar';
import StartPage from '../pages/startpage/Startpage';
import Contact from '../pages/contact/Contact';
import Help from '../pages/help/Help';
import About from '../pages/about/About';
import Dashboard from '../pages/dashboard/Dashboard';
import CustomerPage from '../pages/customerpage/customerpage';
import PageNotFound from '../pages/pageNotFound/pageNotFound';
import AdminPage from '../pages/adminPages/adminPage';
import SupplierPage from '../pages/supplierPages/supplierPage';
import HttpError from '../pages/pageNotFound/HttpErrorPage';

// Context
import { LanguageProvider } from '../../language/LangContext';

// CSS Styling
import './App.css';
import '../basicComp/basic.css';

const Routes = () => {
  return (
    <Switch className='Component'>
      <Route path='/' exact component={StartPage} />
      <Route path='/contact' component={Contact} />
      <Route path='/help' component={Help} />
      <Route path='/about' component={About} />
      <Route path='/dashboard' component={Dashboard} />
      <Route path='/customerpage' component={CustomerPage} />
      <Route path='/supplierpage' component={SupplierPage} />
      <Route path='/admin' component={AdminPage} />
      <Route path='/supplier' component={SupplierPage} />
      <Route path='*' exact={true} component={PageNotFound} />
      <Route path='/error' component={HttpError} />
    </Switch>
  );
};

const App = ({ pca }) => {
  const { inProgress } = useMsal();

  console.log(inProgress);
  return (
    <LanguageProvider>
      <Router>
        <MsalProvider instance={pca}>
          {inProgress === 'login' ? (
            <div>
              <h6> Loading Login......... </h6>
            </div>
          ) : (
            <div className='app W100'>
              <div className='navbar'>
                <Navba />
              </div>
              <div className='startDocumentUnderNavbar W100'>
                <Routes />
              </div>
            </div>
          )}
        </MsalProvider>
      </Router>
    </LanguageProvider>
  );
};

export default App;
