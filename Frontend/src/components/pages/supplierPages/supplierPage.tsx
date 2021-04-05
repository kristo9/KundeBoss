import React from 'react';
import { RouteComponentProps } from 'react-router';
import './customerpage.css';
import '../../basicComp/basic.css';
import { stat } from 'fs';
import { getCustomer } from '../../../azure/api';

//pages:
//import SupplierMailPage from './subPages/SupplierMailPage';
import { SupplierInfoPage } from './subPages/SupplierInfoPage';
//import CustomerNotesPage from './subPages/customerNotesPage';
//import CustomerSupplierPage from './subPages/customerSupplierPage';
//import CustomerEditPage from './subPages/customerEditPage';
import LoadingSymbol from '../../basicComp/loading';
import { SBElementProps, Sidebar } from '../../basicComp/sidebar';
import { isThisTypeNode } from 'typescript';
//import SendMail from './subPages/customerSendMail';

/**
 * Contains the customer page and all the info needed by the subpages.
 * Subpages are also loaded/viewed from here.
 */
class SupplierPage extends React.Component<RouteComponentProps, { pageState: any; supplierInfo: any }> {
  /**
   * @constructor
   * @param {props} props contains infomation about the class.
   */
  constructor(props) {
    super(props);
    this.state = {
      pageState: <LoadingSymbol />,
      supplierInfo: null,
    };
  }

  /**
   * Called immediately after a component is mounted. Setting state here will trigger re-rendering.
   * Gets the customer information from backend and updates the display.
   */
  componentDidMount() {
    // Loades the data from the API
    const fetchCustomerInfo = async () => {
      //Gets information about the customer based on the id in the URL
      await new Promise((r) => setTimeout(r, 500));
      let supplierI = await getCustomer(window.location.pathname.split('/')[2]);
      this.setState({
        supplierInfo: supplierI,
        pageState: <SupplierInfoPage customerInfo={supplierI} />,
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
        <Sidebar
          text={this.state.supplierInfo && this.state.supplierInfo.name ? this.state.supplierInfo.name : 'Leverandørnavn'}
          buttons={this.buttons}
        />
        {this.state.supplierInfo ? this.state.pageState : <LoadingSymbol />}
      </div>
    );
  }

  buttons: SBElementProps = [
    {
      text: 'Infomasjon',
      ID: 'info',
      onClick: () => this.setState({ pageState: <SupplierInfoPage customerInfo={this.state.supplierInfo} /> }),
    },
    {
      text: 'Kunder',
      ID: 'supplier',
      onClick: () => this.setState({ pageState: <SupplierInfoPage customerInfo={this.state.supplierInfo} /> }),
    },
    {
      text: 'Mail',
      ID: 'mail',
      onClick: () => this.setState({ pageState: <SupplierInfoPage customerInfo={this.state.supplierInfo} /> }),
    },
    {
      text: 'Send mail',
      ID: 'sendMail',
      onClick: () => this.setState({ pageState: <SupplierInfoPage customerInfo={this.state.supplierInfo} /> }),
    },
    {
      text: 'Notat',
      ID: 'note',
      onClick: () => this.setState({ pageState: <SupplierInfoPage customerInfo={this.state.supplierInfo} /> }),
    },
    {
      text: 'Rediger',
      ID: 'edit',
      onClick: () => this.setState({ pageState: <SupplierInfoPage customerInfo={this.state.supplierInfo} /> }),
    },
  ];
}

export default SupplierPage;





/*
import React, { useState } from 'react';
import LoadingSymbol from '../../basicComp/loading';

function SupplierPage() {
  const [pageState, setPageState] = useState(<LoadingSymbol />);
  const [supplierInfo, setSupplierInfo] = useState(null);

  async function loadSupplierInfo() {
    // const supplierI =
  }

  return <div>test</div>;
}

export default SupplierPage;
*/