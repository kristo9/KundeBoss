// Libraries.
import { useContext, useEffect, useState } from 'react';

// Components and Function Calls.
import Loading from '../../basicComp/loading';
import PageNotFound from '../pageNotFound/pageNotFound';
import CustomerPage from '../customerpage/customerpage';
import Dashboard from '../dashboard/Dashboard';
import { callLogin } from '../../../azure/api';
import { TypeContext } from '../../../Context/UserType/UserTypeContext';

// CSS.
import './HomePage.css';

/* 
The HomePage component is the component where the userType gets authorised and sent to the right place. The component is
  only called when a authenticated user renders StartPage.tsx.
*/

// Employee and admin function makes Dashboard users destined HomePage.
const EmployeeAndAdmin = () => {
  return (
    <>
      <Dashboard />
    </>
  );
};

// Customer gets its own customerpage as HomePage. 
const Customer = () => {
  return (
    <>
      <CustomerPage />
    </>
  );
};

// Not configured means the user is not ready to be used.
const NotConfigured = () => {
  return (
    <div className='add-margins'>
      <div>
        <h6> HEI {localStorage.getItem('UserName')}</h6> 
        <h6> Not Configured. Contact Admin</h6>
      </div>
    </div>
  );
};

// HompePage function that determines userType of authenticated user. 
const HomePage = () => {
  const { userType, userTypeChange } = useContext(TypeContext); // Import global userType and update function. 
  const [Load, setLoading] = useState(true);                    // Local state to set loading if function is running.
  const [isError, setIsError] = useState(false);                 // Local state to see if any errors occur during function.


  // Sets startup function to run every time component renders for first time.
  useEffect(() => {
    // Function fetch AccountInfo sets userType.
    const fetchAccountInfo = async () => {
      setLoading(true);                             // Sets local state 'Loading' to true. 
      setIsError(false);                               // Sets local state 'Error' to empty.
      try {
        let info = await callLogin();               // CallLogin return user information about authenticated user. 
        switch (true) {                             // Switch until any case is true, and sets userType.
          case info.isConfigured && info.isCustomer:
            userTypeChange('Customer');
            break;
          case info.isConfigured && info.admin === 'write' && info.firstLogin:
            userTypeChange('AdminWriteFirst');
            break;
          case info.isConfigured && info.admin === 'write' && !info.firstLogin:
            userTypeChange('AdminWriteNotFirst');
            break;
          case info.isConfigured && info.admin === 'read' && info.firstLogin:
            userTypeChange('AdminReadFirst');
            break;
          case info.isConfigured && info.admin === 'read' && !info.firstLogin:
            userTypeChange('AdminReadNotFirst');
            break;
          case info.isConfigured && !info.isCustomer && info.admin === null && info.firstLogin:
            userTypeChange('EmployeeFirst');
            break;
          case info.isConfigured && !info.isCustomer && info.admin === null && !info.firstLogin:
            userTypeChange('EmployeeNotFirst');
            break;
          default:                                  // Default value is notConfigured. 
            userTypeChange('NotConfigured');
        }
      } catch (error) {                             // Catch error and set local state to true.
        setIsError(true);
      }
      setLoading(false);                            // Set loading to false when function is excecuted.
  
    }
    fetchAccountInfo();                             // Calls function above.
  }, []);                                           // UseEffect only run once every first render.
  
  return (
    <div>
      {isError ? (                                  // If isError, return error message.
        <div> Det er feil </div>
      ) : Load ? (                                  // If loading, show loading symbol. 
        <Loading />
      ) : userType === 'NotConfigured' ? (          // Users gets sent to right componoment for their HomePage. 
        <NotConfigured />
      ) : userType === 'Customer' ? (
        <Customer />
      ) : userType === 'AdminReadFirst' ? (
        <EmployeeAndAdmin />
      ) : userType === 'AdminReadNotFirst' ? (
        <EmployeeAndAdmin />
      ) : userType === 'AdminWriteFirst' ? (
        <EmployeeAndAdmin />
      ) : userType === 'AdminWriteNotFirst' ? (
        <EmployeeAndAdmin />
      ) : userType === 'EmployeeFirst' ? (
        <EmployeeAndAdmin />
      ) : userType === 'EmployeeNotFirst' ? (
        <EmployeeAndAdmin />
      ) : (
        <PageNotFound />                             // If userType doesnt match any, return PageNotFound.
      )}
    </div>
  );
};

export default HomePage;                            // Default export HomePage.
