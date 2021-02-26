import { callLogin } from "../../../azure/api";
import "./Dashboard.css";
import React from "react";


interface customerProp{
  name: string;
  epost: string;
  divText: string;
}


/**
 * @param {customerProp} customerProp contains the informastion about the customer
 * @returns A react component with a table row contaning customer information
 */
function InfoBox(prop: customerProp){
  return(

        <tr className="rad">
          <td>{prop.name}</td>
          <td>{prop.epost}</td>
          <td>{prop.divText}</td>
         </tr>

  );
}


/**
 * A class that contains and renders the dashboard 
 */
class Dashboard extends React.Component<{},customerProp>{

  //test data
  k = {"kunder": [
    {"name": "navn1", "epost": "epost1", "divText": "Div Text 1"},
    {"name": "navn2", "epost": "epost2", "divText": "Div Text 2"},
    {"name": "navn3", "epost": "epost3", "divText": "Div Text 3"},
    {"name": "navn4", "epost": "epost4", "divText": "Div Text 4"}
  ]
  }

  /**
   * @constructor
   * @param {props} props contains infomation about the class
   */
  constructor(props) {
    super(props);
    this.state = {
      name: "navn",
      epost: "test",
      divText: "abc",
    };
  }

  /**
   * Called immediately after a component is mounted. Setting state here will trigger re-rendering.
   * Gets the customer information from backend and updates the display.
   */
  componentDidMount() {
    const fetchName = async () => {
      const kunde = await callLogin();
      const { name, epost, divText } = kunde.Kunder[1];
      
      this.setState({
        name,
        epost,
        divText
      });
    };
    fetchName();
  }

  /**
   * Rendre the dashboard page
   */
  render() {
    return (
      <div>
        <div className="page">
          <h1>Velkommen</h1>
          <h1>Her er dashboard</h1>
          <div>
            <table className="diasplayTable">
            {
              //Creates a table entry for each customer returned from the database.
              this.k.kunder.map(kunder=>(
                <InfoBox name={kunder.name} epost={kunder.epost} divText={kunder.divText}  />
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