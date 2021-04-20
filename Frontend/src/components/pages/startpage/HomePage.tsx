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
            <Link to='/admin'>
                <br/>
                <u>Admin</u>
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

    console.log("Inne i homepage")
    const [UserCase, setUserCase] = useState(null);
    const [Load, setLoading] = useState(true);
    const [isError, setIsError] = useState(null);
    
    useEffect(() => {
        async function fetchAccountInfo() {
          setLoading(true) 
          let info= await callLogin();
          console.log(info)
          //await new Promise(r => setTimeout(r, 2000));
          console.log(info);


          if (info.isConfigured) {
            if (info.isCustomer) {
              if (info.firstLogin) {
                setUserCase('CustomerFirstLogin')
              }
              else setUserCase('CustomerNotFirst')
            }
            else if (info.admin !== null) {
              if (info.admin === "write") {
                if (info.firstLogin) {
                  setUserCase('AdminWriteFirst')
                }
                else setUserCase('AdminWriteNotFirst')
              }
              else {
                if (info.firstLogin) {
                  setUserCase('AdminReadFirst')
                }
                else setUserCase('AdminReadNotFirst')
              }
            }
            else {
              if (info.firstLogin) {
                setUserCase('EmployeeFirst')
              }
              else setUserCase('EmployeeNotFirst')
            }
          }
          else { setUserCase('NotConfigured') }

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
             (UserCase === 'AdminReadFirst') ? <Admin /> :
             (UserCase === 'AdminReadNotFirst') ? <Admin /> :
             (UserCase === 'AdminWriteFirst') ? <Admin /> :
             (UserCase === 'AdminWriteNotFirst') ? <Admin /> :
             (UserCase === 'EmployeeFirst') ? <Employee /> :
             (UserCase === 'EmployeeNotFirst') ? <Employee /> :
                <PageNotFound />}
        </div>
    );
}

  export default HomePage;