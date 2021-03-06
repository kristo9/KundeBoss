// Libraries
import React from 'react';
import { RouteComponentProps } from 'react-router';
import { getSupplier } from '../../../azure/api';

//Pages:
import SupplierCustomerPage from './subPages/SupplierCustomerPage';
import SupplierNotesPage from './subPages/SupplierNotesPage';
import LoadingSymbol from '../../basicComp/loading';
import { SBElementProps, Sidebar } from '../../basicComp/sidebar';
import SupplierInfoPage from './subPages/SupplierInfoPage';
import SupplierEditPage from './subPages/SupplierEditPage';

// CSS
import '../../basicComp/basic.css';
import '../../basicComp/sidebar.css';

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
    const fetchSupplierInfo = async () => {
      //Gets information about the customer based on the id in the URL
      //await new Promise((r) => setTimeout(r, 500));
      let supplierI = await getSupplier(window.location.pathname.split('/')[2]);
      this.setState({
        supplierInfo: supplierI,
        pageState: <SupplierInfoPage supplierInfo={supplierI} />,
      });
    };
    fetchSupplierInfo();
  }

  /**
   * Renders the class.
   * @returns a react component with the customer page
   */
  render() {
    return (
      <div className='margin-right H100'>
        <Sidebar
          text={
            this.state.supplierInfo && this.state.supplierInfo.name ? this.state.supplierInfo.name : 'Leverandørnavn'
          }
          buttons={this.buttons}
        />
        <div className='addMarginToNotSidebar'>
          {this.state.supplierInfo ? this.state.pageState : <LoadingSymbol />}
        </div>
      </div>
    );
  }

  //The buttons for sidebar
  buttons: SBElementProps = [
    {
      text: 'Infomasjon',
      ID: 'info',
      onClick: () => {
        console.log(this.state.supplierInfo);
        this.setState({ pageState: <SupplierInfoPage supplierInfo={this.state.supplierInfo} /> });
      },
    },
    {
      text: 'Kunder',
      ID: 'supplier',
      onClick: () => this.setState({ pageState: <SupplierCustomerPage supplierInfo={this.state.supplierInfo} /> }),
    },
    {
      text: 'Rediger',
      ID: 'edit',
      onClick: () => this.setState({ pageState: <SupplierEditPage supplierInfo={this.state.supplierInfo} /> }),
    },
  ];
}

export default SupplierPage;
