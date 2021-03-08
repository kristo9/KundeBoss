import React from "react";
import { RouteComponentProps } from "react-router";
import "./customerpage.css";
import "../../basicComp/basic.css";

/**
 * @returns A react component with the customer page
 */
class CustomerPage extends React.Component<RouteComponentProps> {
  /**
   * @constructor
   * @param {props} props contains infomation about the class
   */
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="margin-right H100">
        <div style={{ float: "left", background: "gray", height: "100%", width: "10%" }}>
          <Sidebar />
        </div>
        <div>
          <h1>Velkommen</h1>
          <h1>Her er kundesiden for {this.props.match.params.name}</h1>
        </div>
      </div>
    );
  }
}
/**
 * @returns A react component with the sidebar for the customer page
 */
function Sidebar() {
  return (
    <div className="test">
      <h2>
        <b>Kunde navn</b>
      </h2>
      <SidebarButton text="Mail" />
      <SidebarButton text="Informasjon" />
      <SidebarButton text="Send Mail" />
      <SidebarButton text="div 1" />
      <SidebarButton text="div 2" />
      <SidebarButton text="div 3" />
      <SidebarButton text="div 4" />
    </div>
  );
}
/**
 * @returns A react component with buttons for the sidebar
 * @param {string} text contains button text
 */
function SidebarButton(prop: { text: string }) {
  return (
    <div className="knapp">
      <button className="text">{prop.text}</button>
    </div>
  );
}

export default CustomerPage;
