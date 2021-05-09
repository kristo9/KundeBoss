// Libraries
import react, { createContext, useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

// Components and Function Calls
import Loading from '../../basicComp/loading';
import PageNotFound from '../pageNotFound/pageNotFound';
import CustomerPage from '../customerpage/customerpage';
import { callLogin, getAllEmployees, getEmployee } from '../../../azure/api';

import { TypeContext } from '../../../Context/UserType/UserTypeContext';
import Dashboard from '../dashboard/Dashboard';
import adminIMG from '../../../bilder/admin.jpg';
import dashboardIMG from '../../../bilder/dashboard.jpg';
import LanguageSelector from '../../../Context/language/LangContext';

import './HomePage.css';

const Employee = () => {
  return (
    <>
      <Dashboard />
    </>
  );
};

const Customer = () => {
  return (
    <>
      <CustomerPage />
    </>
  );
};

const Admin = () => {
  return (
    <>
      <div className='admin'>
        <div className='adminLink'>
          <Link to='/admin'>
            <img src={adminIMG} className='adminIMG' alt='Admin' />
          </Link>
          <div className='adminTekst'> ADMIN </div>
        </div>
        <div className='dashboardLink'>
          <Link to='/dashboard'>
            <img src={dashboardIMG} className='dashboardIMG' alt='Dashboard' />
          </Link>
          <div className='dashboardTekst'>KUNDER</div>
          <div className='overlayDashboard'></div>
        </div>
      </div>
    </>
  );
};

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

const HomePage = () => {
  console.log('Inne i homepage');
  const { userType, userTypeChange } = useContext(TypeContext);
  const [UserCase, setUserCase] = useState(null);
  const [Load, setLoading] = useState(true);
  const [isError, setIsError] = useState(null);


  useEffect(() => {
    async function fetchAccountInfo() {
      setLoading(true);
      setIsError('');
      try {
        const customerSelf = await getEmployee();
        const customerSelf2 = await getAllEmployees();
        const info = await callLogin();
        console.log(info)
        console.log(userType)
        console.log(customerSelf)
        console.log(customerSelf2)
        console.log("Heio hei hooooohohoohohohooh!!!!")
        switch (true) {
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
          default:
            userTypeChange('NotConfigured');
        }
      } catch (error) {
        setIsError(true);
      }
      setLoading(false);
  
    }
    fetchAccountInfo();
  }, []);
  
  return (
    <div>
      {isError !== '' ? (
        <div> Det er feil </div>
      ) : Load ? (
        <Loading />
      ) : userType === 'NotConfigured' ? (
        <NotConfigured />
      ) : userType === 'Customer' ? (
        <Customer />
      ) : userType === 'AdminReadFirst' ? (
        <Admin />
      ) : userType === 'AdminReadNotFirst' ? (
        <Admin />
      ) : userType === 'AdminWriteFirst' ? (
        <Admin />
      ) : userType === 'AdminWriteNotFirst' ? (
        <Admin />
      ) : userType === 'EmployeeFirst' ? (
        <Employee />
      ) : userType === 'EmployeeNotFirst' ? (
        <Employee />
      ) : (
        <PageNotFound />
      )}
    </div>
  );
};

export default HomePage;
