import React, { useState } from 'react';
import { RouteComponentProps } from 'react-router';

import Searchfield from '../../basicComp/searchfield';
import LoadingSymbol from '../../basicComp/loading';
import { SBElementProps, SBProps, Sidebar } from '../../basicComp/sidebar';

//pages
import NewCustomer from './newCustomer';
import ViewRights from './viewRights';
import NewSupplier from './newSupplier';
import { getAllEmployees } from '../../../azure/api';

// const mockData = {
//   users: [
//     {
//       _id: '603648ae0ab39703a4580395',
//       name: 'Didrik K Bjerk',
//       employeeId: 'didrik.bjerk@kundeboss.onmicrosoft.com',
//     },
//     {
//       _id: '603648420ab39703a4580395',
//       name: 'Alexander',
//       employeeId: 'alexander.bjerk@kundeboss.onmicrosoft.com',
//     },
//   ],
// };

class AdminPage extends React.Component<RouteComponentProps, { pageState: any; adminInfo: any; search: any }> {
  /**
   * @constructor
   * @param {props} props contains infomation about the class.
   */
  constructor(props) {
    super(props);
    this.state = {
      pageState: <LoadingSymbol />,
      adminInfo: null,
      search: ' ',
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
      let adminI = await getAllEmployees();
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
        {this.state.adminInfo ? this.state.pageState : <LoadingSymbol />}
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
      onClick: () => this.setState({ pageState: <ViewRights adminData={this.state.adminInfo} /> }),
    },
    {
      text: 'Ny leverandør',
      ID: 'newSupplier',
      onClick: () => this.setState({ pageState: <ViewRights adminData={this.state.adminInfo} /> }),
    },
    {
      text: 'Nyinnlogget',
      ID: 'newLogin',
      onClick: () => this.setState({ pageState: <ViewRights adminData={this.state.adminInfo} /> }),
    }, //TODO: lage side for nyinnlogget
  ];
}

// interface userInfo {
//   name: string;
//   type?: string;
// }

// function DisplayInfo(props: userInfo) {
//   return (
//     <p>
//       <b>{props.name} </b>

//       {props.type === 'customer' ? 'Kunde' : 'Ansatt'}
//     </p>
//   );
// }

export default AdminPage;
