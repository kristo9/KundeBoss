// Libaries
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { MsalProvider, useMsal } from '@azure/msal-react';

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
import SupplierPage from '../pages/supplierPages/supplierPage';
import HttpError from '../pages/pageNotFound/HttpErrorPage';
import MailReply from '../pages/mailReply/MailReply';


// Context
import { LanguageProvider } from '../../Context/language/LangContext';
import { UserTypeProvider } from '../../Context/UserType/UserTypeContext';

// CSS Styling
import './App.css';
import '../basicComp/basic.css';

// Url extensions (path) that brings user to specified component. 
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
      <Route path='/replymail' component={MailReply} />
      <Route path='*' exact={true} component={PageNotFound} />
      <Route path='/error' component={HttpError} />
    </Switch>
  );
};

// Gets pca instance from index.tsx
const App = ({ pca }) => {

  const { inProgress } = useMsal();

  return (
    <LanguageProvider>                            {/*Provider for global language context*/}
      <UserTypeProvider>                          {/*Provider for global userType context*/}
        <Router>                                  {/*Provider for routes*/}
          <MsalProvider instance={pca}>           {/*Provider for msal login context*/}
            {inProgress === 'login' ? (           /* Checks, and waits, if in login process */
              <div>
                <h6> Loading Login......... </h6>
              </div>
            ) : (                                 /*If not in login process, setting navbar and route*/
              <div className='app W100'>
                <div className='navbar'>
                  <Navbar />                      {/*Places navbar on top. Navbar is always on top of routes components.*/}
                </div>
                <div className='startDocumentUnderNavbar W100'>
                  <Routes />                      {/*Routes component depending on which routelink.*/}
                </div>
              </div>
            )}
          </MsalProvider>
        </Router>
      </UserTypeProvider>
    </LanguageProvider>
  );
};

export default App;
