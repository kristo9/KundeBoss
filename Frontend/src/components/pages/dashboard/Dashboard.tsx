// Libraries
import React from 'react';
import LoadingSymbol from '../../basicComp/loading';

// Component and function imports
import { getEmployee } from '../../../azure/api';
import { useHistory } from 'react-router-dom';

// CSS imports
import './Dashboard.css';
import '../../basicComp/basic.css';
import { propTypes } from 'react-bootstrap/esm/Image';

let customers = getEmployee();

/**
 * A class that contains and renders the dashboard
 */
class Dashboard extends React.Component<{}, { customers: any; search: string }> {
  /**
   * @constructor
   * @param {props} props contains infomation about the class
   */
  constructor(props) {
    super(props);
    this.state = {
      customers: null,
      search: '',
      // error: '',
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
        customers,
      });
    };
    fetchName();
  }

  /**
   * Rendre the dashboard page
   */

  updateSearch(event) {
    this.setState({ search: event.target.value.substr(0, 20) });
  }

  render() {
    let filteredCustomers = null;

    if (this.state.customers) {
      filteredCustomers = this.state.customers.customerInformation.filter((customer) => {
        const tag = customer.tags.toString().toLowerCase();
        const name = customer.name.toString().toLowerCase();
        const currsearch = tag + name;
        return currsearch.indexOf(this.state.search.toLowerCase()) !== -1;
      });
    }

    return (
      <div className='add-margins'>
        {this.displayGreeting()}
        <div style={{ float: 'right' }}>
          <input
            className='search'
            type='text'
            placeholder='Search name or tag'
            value={this.state.search}
            onChange={this.updateSearch.bind(this)}
          />
        </div>
        <div>{this.displayCustomers(filteredCustomers)}</div>
      </div>
    );
  }

  /**
   * Displays a greeting if the user is logged in.
   */
  private displayGreeting() {
    if (this.state.customers && this.state.customers.name) {
      return <h1>Velkommen {this.state.customers.name.split(' ')[0]}</h1>;
    } else {
      return <h1>Velkommen</h1>;
    }
  }

  /**
   * Displays the emplyees customers
   */
  private displayCustomers(filteredCustomers) {
    if (this.state.customers) {
      return (
        <table className='diasplayTable'>
          <tbody>
            {
              //Creates a table entry for each customer returned from the database.
              filteredCustomers.map((customer) => (
                <InfoBox
                  customerName={customer.name}
                  contactName={customer.contact.name}
                  mail={customer.contact.mail}
                  tags={customer.tags}
                  key={customer._id}
                  id={customer._id}
                />
              ))
            }
          </tbody>
        </table>
      );
    } else {
      return <LoadingSymbol />;
    }
  }
}

interface customerProp {
  customerName: string;
  contactName: string;
  mail: string;
  tags?: any;
  id: string;
}

/**
 * @param {customerProp} prop contains the informastion about the customer
 * @returns A react component with a table row contaning customer information
 */
function InfoBox(prop: customerProp) {
  let history = useHistory();
  const tags = prop.tags;

  return (
    <tr
      tabIndex={0}
      className='rad'
      onClick={() => {
        history.push('/customerpage/' + prop.id);
      }}
    >
      <td>
        <b>{prop.customerName}</b>
      </td>
      <td>{prop.contactName}</td>
      <td>{prop.mail}</td>
      <td> {tags.length === 0 ? 'Ingen Tags' : prop.tags.toString().split(',').join(', ')} </td>
    </tr>
  );
}

export default Dashboard;
