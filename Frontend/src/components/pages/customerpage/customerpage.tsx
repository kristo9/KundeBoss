import React from 'react';
import { RouteComponentProps } from 'react-router';
import './customerpage.css';
import '../../basicComp/basic.css';
import { stat } from 'fs';
import { getCustomer } from '../../../azure/api';

//pages:
import CustomerMailPage from './subPages/customerMailPage';
import { CustomerInfoPage } from './subPages/customerInfoPage';
import CustomerNotesPage from './subPages/customerNotesPage';
import CustomerSupplierPage from './subPages/customerSupplierPage';
import CustomerEditPage from './subPages/customerEditPage';
import LoadingSymbol from '../../basicComp/loading';
import { SBElementProps, Sidebar } from '../../basicComp/sidebar';
import { isThisTypeNode } from 'typescript';
import SendMail from './subPages/customerSendMail';

/**
 * Contains the customer page and all the info needed by the subpages.
 * Subpages are also loaded/viewed from here.
 */
class CustomerPage extends React.Component<RouteComponentProps, { pageState: any; customerInfo: any, error: string }> {
  /**
   * @constructor
   * @param {props} props contains infomation about the class.
   */
  constructor(props) {
    super(props);
    this.state = {
      pageState: <LoadingSymbol />,
      customerInfo: null,
      error: '',
    };
  }

  /**
   * Called immediately after a component is mounted. Setting state here will trigger re-rendering.
   * Gets the customer information from backend and updates the display.
   */
  componentDidMount() {
    // Loades the data from the API

    const fetchCustomerInfo = async () => {

      let customerI
      //Gets information about the customer based on the id in the URL
      try {
        await new Promise((r) => setTimeout(r, 500));
        customerI = await getCustomer(window.location.pathname.split('/')[2]);
        this.setState({
          customerInfo: customerI,
          pageState: <CustomerInfoPage customerInfo={customerI} />,
          error: ''
      });
      }
      catch {
        this.setState( {
          customerInfo: null,
          pageState: <CustomerInfoPage customerInfo={customerI} />,
          error: customerI
        })
      }
    };
    fetchCustomerInfo();
  }

  /**
   * Renders the class.
   * @returns a react component with the customer page
   */
  render() {

    console.log(this.state.error)

    return (
      <div className='margin-right H100'>
        <Sidebar
          text={this.state.customerInfo && this.state.customerInfo.name ? this.state.customerInfo.name : 'Kundenavn'}
          buttons={this.buttons}
        />
        {this.state.customerInfo ? this.state.pageState : <LoadingSymbol />}
      </div>
    );
  }

  buttons: SBElementProps = [
    {
      text: 'Infomasjon',
      ID: 'info',
      onClick: () => this.setState({ pageState: <CustomerInfoPage customerInfo={this.state.customerInfo} /> }),
    },
    {
      text: 'Leverandører',
      ID: 'supplier',
      onClick: () => this.setState({ pageState: <CustomerSupplierPage customerInfo={this.state.customerInfo} /> }),
    },
    {
      text: 'Mail',
      ID: 'mail',
      onClick: () => this.setState({ pageState: <CustomerMailPage customerInfo={this.state.customerInfo} /> }),
    },
    {
      text: 'Send mail',
      ID: 'sendMail',
      onClick: () => this.setState({ pageState: <SendMail customerInfo={this.state.customerInfo} /> }),
    },
    {
      text: 'Notat',
      ID: 'note',
      onClick: () => this.setState({ pageState: <CustomerNotesPage customerInfo={this.state.customerInfo} /> }),
    },
    {
      text: 'Rediger',
      ID: 'edit',
      onClick: () => this.setState({ pageState: <CustomerEditPage customerInfo={this.state.customerInfo} /> }),
    },
  ];
}

export default CustomerPage;
