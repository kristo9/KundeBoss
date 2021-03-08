import { getEmployee, modifyEmployeeData } from "../../../azure/api";
import "./Dashboard.css";
import React from "react";
import { Link } from "react-router-dom";
import Inputfield from "../../../components/basicComp/searchfield";

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
      customers: null,
    };
  }

  /**
   * Called immediately after a component is mounted. Setting state here will trigger re-rendering.
   * Gets the customer information from backend and updates the display.
   */
  componentDidMount() {
    const fetchName = async () => {
      customers = await customers;

      if (typeof customers !== "object") {
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
  render() {
    {
      console.log(this.state.customers);
    }

    return (
      <div className="add-margins">
        <div className="page">
          {this.displayGreeting()}
          <div style={{ float: "right" }}>
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
    if (this.state.customers && this.state.customers.name) {
      modifyEmployeeData("per.aasrud@kundeboss.onmicrosoft.com", "Por Arild R Johkfannesen", "write", false, null);
      return <h1>Velkommen {this.state.customers.name.split(" ")[0]}</h1>;
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
        <table className="diasplayTable">
          <tbody>
            {
              //Creates a table entry for each customer returned from the database.
              this.state.customers.customerInformation.map((customer) => (
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
  return (
    <tr
      className="rad"
      onClick={() => {
        <Link
          to={{
            pathname: "/customerpage/" + prop.customerName,
            state: {
              id: 37,
              name: prop.customerName,
            },
          }}
        ></Link>;
        console.log("trykk " + prop.customerName);
      }}
    >
      <td>
        <Link
          to={{
            pathname: "/customerpage/" + prop.id,
            state: {
              id: 37,
              name: prop.customerName,
            },
          }}
        >
          <b>{prop.customerName}</b>
        </Link>
      </td>
      <td>{prop.contactName}</td>
      <td>{prop.mail}</td>
    </tr>
  );
}

export default Dashboard;
