// Libraries
import react, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';

// Components and Function Calls 
import Loading from '../../basicComp/loading';
import PageNotFound from '../pageNotFound/pageNotFound'
import { callLogin } from '../../../azure/api';



const Employee = () => {

    return (
        <div className='add-margins'>
          <div>
          <h6> HEI {localStorage.getItem("UserName")}</h6>
          <h6> Employee </h6>
            <Link to='/dashboard'>
                <u>Dashboard</u>
            </Link>
          </div>
        </div>
    )
}



const Customer = () => {
    
    return (
        <div className='add-margins'>
          <div>
          <h6> HEI {localStorage.getItem("UserName")}</h6>
          <h6> Customer </h6>
            <Link to='/dashboard'>
                <u>Dashboard</u>
            </Link>
          </div>
        </div>
    )

}

const Admin = () => {

    return (
        <div className='add-margins'>
          <div>
          <h6> HEI {localStorage.getItem("UserName")}</h6>
          <h6> Admin </h6>
            <Link to='/dashboard'>
                <u>Dashboard</u>
            </Link>
          </div>
        </div>
    )

}

const NotConfigured = () => {

    return (
        <div className='add-margins'>
          <div>
          <h6> HEI {localStorage.getItem("UserName")}</h6>
          <h6> Not Configured. Contact Admin</h6>
            
          </div>
        </div>
    )

}

const HomePage = () => {

    const [UserCase, setUserCase] = useState(null);
    const [Load, setLoading] = useState(true);
    
    useEffect(() => {
        async function fetchAccountInfo() {
          setLoading(true)  
          let info= await callLogin();
          console.log(info);
          (!info.isConfigured) ? setUserCase('NotConfigured') :
          (info.isCustomer) ? (info.firstLogin) ? setUserCase('CustomerFirstLogin'): setUserCase('CustomerNotFirst') : 
          (info.firstLogin) ? (info.admin === Admin) ? setUserCase('AdminFirst'): setUserCase('EmployeeFirst') 
                            : (info.admin === Admin) ? setUserCase('AdminNotFirst') : setUserCase('EmployeeNotFirst');
          setLoading(false)
        }
        fetchAccountInfo()
      }, [])

    return (
        <div>
            {(Load) ? <Loading /> :
             (UserCase === 'NotConfigured') ? <NotConfigured />:
             (UserCase === 'CustomerFirstLogin') ? <Customer /> :
             (UserCase === 'CustomerNotFirst') ? <Customer /> :
             (UserCase === 'AdminFirst') ? <Admin /> :
             (UserCase === 'AdminNotFirst') ? <Admin /> :
             (UserCase === 'EmployeeFirst') ? <Employee /> :
             (UserCase === 'EmployeeNotFirst') ? <Employee /> :
                <PageNotFound />}
        </div>
    );
}

  export default HomePage;