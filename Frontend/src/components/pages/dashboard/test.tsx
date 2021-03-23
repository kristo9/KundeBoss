import { getEmployee } from '../../../azure/api';
import './Dashboard.css';
import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Inputfield from '../../../components/basicComp/searchfield';


const DisplayCustomers = (props) => {
    if (props.customers) {
      console.log('cust');
      console.log(props.customers.name);
      return (
        <table className='diasplayTable'>
          <tbody>
            {
              //Creates a table entry for each customer returned from the database.
              props.customers.customerInformation.map((customer) => (
                <InfoBox
                  customerName={customer.name}
                  contactName={customer.contact.name}
                  mail={customer.contact.mail}
                  key={customer._id}
                  id={customer._id}
                />
              ))
            }
          </tbody>
        </table>
      );
    } else {
      return (
        <div>
          <p>Henter data...</p>
        </div>
      );
    }
}


const DisplayGreeting = (props) => {
    useState
    if (props.customers && props.customers.name) {
      return <h1>Velkommen {props.customers.name.split(' ')[0]}</h1>;
    } else {
      return <h1>Velkommen</h1>;
    }
}

const InfoBox = (props) => {
    return (
      <tr
        className='rad'
        onClick={() => {
          <Link to={{ pathname: '/customerpage/' + props.id }}></Link>;
          console.log('trykk ' + props.id);
        }}
      >
        <td>
          <Link to={{ pathname: '/customerpage/' + props.id }}>
            <b>{props.customerName}</b>
          </Link>
        </td>
        <td>{props.contactName}</td>
        <td>{props.mail}</td>
      </tr>
    );
}


const Dashboard = () => {

    const [customers, setCustomers] = useState('Loading');
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);
  
    
    useEffect(() => {
        async function fetchCustomers() {
            setIsError(false);
            setIsLoading(true);

            let customers = await getEmployee();
            console.log(customers);
            if (typeof customers !== 'object') {
              customers = await getEmployee();
              }
              this.setState({
                customers,
              });
            setIsLoading(false);
            };
        fetchCustomers()
      }, [])

    return (
        <div className='add-margins'>
          <div className='page'>
            <div>
                <DisplayGreeting key={customers} />
            </div>
            <div style={{ float: 'right' }}>
                <Inputfield />
            </div>
            <div>
                <DisplayCustomers key={customers}/>
            </div>
          </div>
        </div>
      );
}

export default Dashboard;