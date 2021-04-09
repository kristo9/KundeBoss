import React, { useState } from 'react';
import { RouteComponentProps } from 'react-router';

import Searchfield from '../../basicComp/searchfield';
import LoadingSymbol from '../../basicComp/loading';
import { SBElementProps, SBProps, Sidebar } from '../../basicComp/sidebar';
import SupplierInfoPage from './supplierInfoPage';
import { getSupplier } from '../../../azure/api';
import { CustomerInfoPage } from '../customerpage/customerInfoPage';
import SupplierCustomerPage from './supplierCustomerPage';

//pages

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
      await new Promise((r) => setTimeout(r, 1000));
      let supplierI = await getSupplier('605b37ae6c35ab18d8c49da7'); //605b37ae6c35ab18d8c49da9
      console.log(supplierI);
      this.setState({
        supplierInfo: supplierI,
        pageState: <SupplierInfoPage supplierInfo={supplierI} />,
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
        {this.state.supplierInfo ? this.state.pageState : <LoadingSymbol />}
      </div>
    );
  }

  buttons: SBElementProps = [
    {
      text: 'Informasjon',
      ID: 'info',
      onClick: () => this.setState({ pageState: <SupplierInfoPage supplierInfo={this.state.supplierInfo} /> }),
    },
    {
      text: 'Kunder',
      ID: 'customers',
      onClick: () => this.setState({ pageState: <SupplierCustomerPage supplierInfo={this.state.supplierInfo} /> }),
    },
  ];
}
export default SupplierPage;
