import { callLogin, getEmployee } from "../../../azure/api";
import "./Dashboard.css";
import React from "react";


interface customerProp{
  customerName: string;
  contactName: string;
  mail: string;
  tags?: any;
}


/**
 * @param {customerProp} customerProp contains the informastion about the customer
 * @returns A react component with a table row contaning customer information
 */
function InfoBox(prop: customerProp){
  return(

        <tr className="rad">
          <td>{prop.customerName}</td>
          <td>{prop.contactName}</td>
          <td>{prop.mail}</td>
         </tr>

  );
}


/**
 * A class that contains and renders the dashboard 
 */
class Dashboard extends React.Component<{},{customers: any}>{

  //test data
  k = {"customerName": [
    {"name": "navn1", "epost": "epost1", "divText": "Div Text 1"},
    {"name": "navn2", "epost": "epost2", "divText": "Div Text 2"},
    {"name": "navn3", "epost": "epost3", "divText": "Div Text 3"},
    {"name": "navn4", "epost": "epost4", "divText": "Div Text 4"}
  ]
  };

  kr = {
    "customerInformation": [
        {
          "_id": "6038a9dd01c4ba40c8203cc5",
          "name": "Test AS",
          "contact": {
            "mail": "Test@mail.no",
            "name": "Test"
          },
          "tags": []
        }
      ]
    }

  /**
   * @constructor
   * @param {props} props contains infomation about the class
   */
  constructor(props) {
    super(props);
    this.state = {
      customers: this.kr
    };
  }

  /**
   * Called immediately after a component is mounted. Setting state here will trigger re-rendering.
   * Gets the customer information from backend and updates the display.
   */
  componentDidMount() {
    const fetchName = async () => {
      const customers = await getEmployee();
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
      console.log(this.state.customers)
    }

    return (
      <div>
        <div className="page">
          <h1>Velkommen</h1>
          <h1>Her er dashboard</h1>
          <div>
            <table className="diasplayTable">
            {
                //Creates a table entry for each customer returned from the database.
                this.state.customers.customerInformation.map(customer=>(
                  <InfoBox customerName={customer.name} contactName={customer.contact.name} mail={customer.contact.mail} key={customer._id}/>
                ))
            }
            </table>
          </div>
        </div>
      </div>
    );
  }
}

export default Dashboard;