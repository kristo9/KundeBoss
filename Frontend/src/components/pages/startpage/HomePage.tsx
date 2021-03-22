// Libraries
import react, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';

// Components and Function Calls 
import Loading from '../../basicComp/loading';
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

const HomePage = () => {

    const [role, setRole] = useState('Loading');
    const [firstLoggin, setFirstLoggin] = useState('L');
    const [userCase, setUserCase] = useState(null);
    
    useEffect(() => {
        async function fetchAccountInfo() {
          let info= await callLogin();
          console.log(info)
          info = info.admin
          setRole(info)
        }
        fetchAccountInfo()
      }, [])

    console.log("Rollen er:  " + role);
    return (
        <div>
            {(role === 'Loading') ? <Loading /> :
                (role !== null) ? <Admin /> : <Employee />}
        </div>
    );
}

  export default HomePage;