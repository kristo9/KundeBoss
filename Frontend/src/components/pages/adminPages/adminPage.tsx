import React, { useState } from 'react';
import { RouteComponentProps } from 'react-router';
import { getAllEmployees } from '../../../azure/api';

import LoadingSymbol from '../../basicComp/loading';
import { SBElementProps, Sidebar } from '../../basicComp/sidebar';

//pages

import ViewRights from './subPages/viewRights';
import CustomerEditPage from '../customerpage/subPages/customerEditPage';
import SupplierEditPage from '../supplierPages/subPages/SupplierEditPage';

import NewEntry from './subPages/NewEntry';

//CSS
import '../../basicComp/sidebar.css';
import '../customerpage/customerpage.css';

class AdminPage extends React.Component<RouteComponentProps, { pageState: any; adminInfo: any }> {
  /**
   * @constructor
   * @param {props} props contains infomation about the class.
   */
  constructor(props) {
    super(props);
    this.state = {
      pageState: <LoadingSymbol />,
      adminInfo: null,
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
      //await new Promise((r) => setTimeout(r, 500));
      let adminI = await getAllEmployees();
      console.log(adminI);
      this.setState({
        adminInfo: adminI,
        pageState: <ViewRights adminData={adminI} />,
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
        <Sidebar text='Admin side' buttons={this.buttons} />
        <div className='addMarginToNotSidebar'>{this.state.adminInfo ? this.state.pageState : <LoadingSymbol />}</div>
      </div>
    );
  }

  buttons: SBElementProps = [
    {
      text: 'Se rettigheter',
      ID: 'rights',
      onClick: () => this.setState({ pageState: <ViewRights adminData={this.state.adminInfo} /> }),
    },
    {
      text: 'Ny kunde',
      ID: 'newCustomer',
      onClick: () => this.setState({ pageState: <CustomerEditPage /> }),
    },
    {
      text: 'Ny leverandør',
      ID: 'newSupplier',
      onClick: () => this.setState({ pageState: <SupplierEditPage /> }),
    },
    {
      text: 'Nyinnlogget',
      ID: 'newLogin',
      onClick: () => this.setState({ pageState: <NewEntry /> }),
    }, //TODO: lage side for nyinnlogget
  ];
}

export default AdminPage;
