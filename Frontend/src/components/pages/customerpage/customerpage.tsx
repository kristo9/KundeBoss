import React from 'react';
import { RouteComponentProps } from 'react-router';
import './customerpage.css';
import '../../basicComp/basic.css';
import { stat } from 'fs';
import { getCustomer } from '../../../azure/api';

//pages:
import CustomerMailPage from './customerMailPage';
import { CustomerInfoPage } from './customerInfoPage';
import CustomerNotesPage from './customerNotesPage';
import CustomerSupplierPage from './customerSupplierPage';
import CustomerEditPage from './customerEditPage';

/**
 * Contains the customer page and all the info needed by the subpages.
 * Subpages are also loaded/viewed from here.
 */
class CustomerPage extends React.Component<RouteComponentProps, { buttonState: number; customerInfo: any }> {
  /**
   * @constructor
   * @param {props} props contains infomation about the class.
   */
  constructor(props) {
    super(props);
    this.state = {
      buttonState: 0,
      customerInfo: null,
    };
  }

  // A list with all the subpages
  private pageList = [
    CustomerInfoPage,
    CustomerSupplierPage,
    CustomerMailPage,
    CustomerMailPage,
    CustomerNotesPage,
    CustomerEditPage,
  ];

  /**
   * Called immediately after a component is mounted. Setting state here will trigger re-rendering.
   * Gets the customer information from backend and updates the display.
   */
  componentDidMount() {
    // Loades the data from the API
    const fetchCustomerInfo = async () => {
      let customerI = await getCustomer('60461a9a4ceb3ceb38bc803d'); //TODO: endre denne
      this.setState({
        customerInfo: customerI,
      });
    };
    fetchCustomerInfo();
  }

  /**
   * Renders the class.
   * @returns a react component with the customer page
   */
  render() {
    return (
      <div className='margin-right H100'>
        {this.renderSidebar()}
        <div>{this.pageList[this.state.buttonState](this.state.customerInfo)}</div>
      </div>
    );
  }

  /**
   * @returns A react component with the sidebar for the customer page
   */
  renderSidebar() {
    return (
      <div className='sidebar'>
        <h2>
          <b>Kunde navn</b>
        </h2>
        <SidebarButton
          onClick={() => this.changePageState(0)}
          active={this.state.buttonState === 0}
          text='Informasjon'
        />
        <SidebarButton
          onClick={() => this.changePageState(1)}
          active={this.state.buttonState === 1}
          text='Leverandører'
        />
        <SidebarButton onClick={() => this.changePageState(2)} active={this.state.buttonState === 2} text='Mail' />
        <SidebarButton
          onClick={() => this.changePageState(3)}
          active={this.state.buttonState === 3}
          text='Sende Mail'
        />
        <SidebarButton onClick={() => this.changePageState(4)} active={this.state.buttonState === 4} text='Notater' />
        <SidebarButton onClick={() => this.changePageState(5)} active={this.state.buttonState === 5} text='Rediger' />
      </div>
    );
  }

  /**
   * Changes the page.
   * @param {number} prop is the ID of page it should change to.
   */
  changePageState(prop: number) {
    if (this.state.buttonState !== prop) {
      this.setState({ buttonState: prop });
    }
  }
}

/**
 * Creates a button based on the input-parameters.
 * @param {string} text the button text.
 * @param {any} onCLick a function that is executed when the button is pressed.
 * @param {boolean} active if the button is currently selected.
 * @returns A react component with buttons for the sidebar.
 */
function SidebarButton(prop: { text: string; onClick: any; active: boolean }) {
  let classNameName = prop.active ? 'b buttonActive' : 'b buttonNotActive';

  return (
    <div className={classNameName} onClick={prop.onClick}>
      <button>{prop.text}</button>
    </div>
  );
}

export default CustomerPage;
