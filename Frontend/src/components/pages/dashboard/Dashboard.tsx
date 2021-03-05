import { callLogin, getEmployee, modifyEmployeeData } from '../../../azure/api';
import './Dashboard.css';
import React from 'react';
import { useHistory } from 'react-router-dom';
import Inputfield from '../../../components/basicComp/searchfield';

let customers = getEmployee();

/**
 * A class that contains and renders the dashboard
 */
class Dashboard extends React.Component<{}, { customers: any }> {
  /**
   * @constructor
   * @param {props} props contains infomation about the class
   */
  constructor(props) {
    super(props);
    this.state = {
      customers: null
    };
  }

  /**
   * Called immediately after a component is mounted. Setting state here will trigger re-rendering.
   * Gets the customer information from backend and updates the display.
   */
  componentDidMount() {
    const fetchName = async () => {
      customers = await customers;

      if (typeof customers !== 'object') {
        customers = await getEmployee();
      }
      this.setState({
        customers
      });
    };
    fetchName();
  }

  /**
   * Rendre the dashboard page
   */
  render() {
    {
      console.log(this.state.customers);
    }

    return (
      <div>
        <div className='page'>
          {this.displayGreeting()}
          <div style={{ float: 'right' }}>
            <Inputfield />
          </div>
          <div>{this.displayCustomers()}</div>
        </div>
      </div>
    );
  }

  /**
   * Displays a greeting if the user is logged in.
   */
  private displayGreeting() {
    modifyEmployeeData('per.aasrud@kundeboss.onmicrosoft.com', 'Por Arild R Johkfannesen', 'false', null, 'write');
    if (this.state.customers && this.state.customers.name) {
      return <h1>Velkommen {this.state.customers.name.split(' ')[0]}</h1>;
    } else {
      return <h1>Velkommen</h1>;
    }
  }

  /**
   * Displays the emplyees customers
   */
  private displayCustomers() {
    if (this.state.customers) {
      return (
        <table className='diasplayTable'>
          {
            //Creates a table entry for each customer returned from the database.
            this.state.customers.customerInformation.map((customer) => (
              <InfoBox
                customerName={customer.name}
                contactName={customer.contact.name}
                mail={customer.contact.mail}
                key={customer._id}
              />
            ))
          }
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
}

interface customerProp {
  customerName: string;
  contactName: string;
  mail: string;
  tags?: any;
}

/**
 * @param {customerProp} prop contains the informastion about the customer
 * @returns A react component with a table row contaning customer information
 */
function InfoBox(prop: customerProp) {
  return (
    <tr
      className='rad'
      onClick={() => {
        console.log('trykk ' + prop.customerName);
      }}
    >
      <td>
        <button>
          <b>{prop.customerName}</b>
        </button>
      </td>
      <td>{prop.contactName}</td>
      <td>{prop.mail}</td>
    </tr>
  );
}

export default Dashboard;
