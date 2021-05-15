// Libraries
import { useContext, useEffect, useState } from 'react';

// Pages and Components
import CustomerMailPage from './subPages/customerMailPage';
import CustomerSupplierPage from './subPages/customerSupplierPage';
import CustomerEditPage from './subPages/customerEditPage';
import LoadingSymbol from '../../basicComp/loading';
import SendMail from './subPages/customerSendMail';
import { CustomerInfoPage } from './subPages/customerInfoPage';
import { SBElementProps, Sidebar } from '../../basicComp/sidebar';
import { getCustomer, getEmployee } from '../../../azure/api';

// Context
import { TypeContext } from '../../../Context/UserType/UserTypeContext';

// CSS
import '../../basicComp/basic.css';
import '../../basicComp/sidebar.css';

/**
 * Contains the customer page and all the info needed by the subpages.
 * Subpages are also loaded/viewed from here.
 */

const CustomerPage = () => {
  const { userType } = useContext(TypeContext);

  const [pageState, setPageState] = useState(<LoadingSymbol />);
  const [customerInfo, setCustomerInfo] = useState(null);
  const [buttons, setButtons] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const FetchCustomerInfo = async () => {
      let customerI = null;
      console.log(userType + ' Det er det jeg er ;)');

      if (userType === 'Customer') {
        console.log('Inne');
        const customerSelf = await getEmployee();
        customerI = await getCustomer(customerSelf.customerInformation[0]._id);
        setButtons('ButtonsRead');
      } else {
        console.log('Ute :(');
        customerI = await getCustomer(window.location.pathname.split('/')[2]);
        setButtons('Buttons');
      }
      setCustomerInfo(customerI);
      setPageState(<CustomerInfoPage customerInfo={customerI} />);
    };

    FetchCustomerInfo();
  }, []);

  return (
    <div>
      {buttons === null ? null : (
        <section className='margin-right H100'>
          {buttons == 'ButtonsRead' ? (
            <Sidebar
              text={customerInfo && customerInfo.name ? customerInfo.name : 'Kundenavn'}
              buttons={ButtonsRead({ setPageState }, { customerInfo })}
            />
          ) : (
            <Sidebar
              text={customerInfo && customerInfo.name ? customerInfo.name : 'Kundenavn'}
              buttons={Buttons({ setPageState }, { customerInfo })}
            />
          )}
          <div className='addMarginToNotSidebar'>{customerInfo ? pageState : <LoadingSymbol />}</div>
        </section>
      )}
    </div>
  );
};

const Buttons = ({ setPageState }, { customerInfo }) => {
  const buttons: SBElementProps = [
    {
      text: 'Infomasjon',
      ID: 'info',
      onClick: () => setPageState(<CustomerInfoPage customerInfo={customerInfo} />),
    },
    {
      text: 'Leverandører',
      ID: 'supplier',
      onClick: () => setPageState(<CustomerSupplierPage customerInfo={customerInfo} customer={false} />),
    },
    {
      text: 'Mail',
      ID: 'mail',
      onClick: () => setPageState(<CustomerMailPage customerInfo={customerInfo} />),
    },
    {
      text: 'Send mail',
      ID: 'sendMail',
      onClick: () => setPageState(<SendMail customerID={[customerInfo._id]} />),
    },
    {
      text: 'Rediger',
      ID: 'edit',
      onClick: () => setPageState(<CustomerEditPage customerInfo={customerInfo} />),
    },
  ];

  return buttons;
};

const ButtonsRead = ({ setPageState }, { customerInfo }) => {
  const buttonsRead: SBElementProps = [
    {
      text: 'Infomasjon',
      ID: 'info',
      onClick: () => setPageState(<CustomerInfoPage customerInfo={customerInfo} />),
    },
    {
      text: 'Leverandører',
      ID: 'supplier',
      onClick: () => setPageState(<CustomerSupplierPage customerInfo={customerInfo} customer={true} />),
    },
  ];
  return buttonsRead;
};

export default CustomerPage;

/*
class CustomerPage extends React.Component<RouteComponentProps, { pageState: any; customerInfo: any; error: string; customer: boolean }> {
  /**
   * @constructor
   * @param {props} props contains infomation about the class.
   */
/*
  constructor(props) {
    super(props);
    this.state = {
      pageState: <LoadingSymbol />,
      customerInfo: null,
      error: '',
      customer: false,
    };
  }

  /**
   * Called immediately after a component is mounted. Setting state here will trigger re-rendering.
   * Gets the customer information from backend and updates the display.
   */
/*
  componentDidMount() {
    // Loades the data from the API

    const FetchCustomerInfo = async () => {
      //Gets information about the customer based on the id in the URL or customers own id
      const userType = GetUserType();
      let customerI;

      if(userType === 'CustomerFirstLogin' || userType === 'CustomerNotFirst' ) {
        const customerSelf = await getEmployee()
        console.log(customerSelf)
        customerI = await getCustomer(window.location.pathname.split('/')[2]);
      }
      else {
        customerI = await getCustomer(window.location.pathname.split('/')[2]);
      }

      this.setState({
        customerInfo: customerI,
        pageState: <CustomerInfoPage customerInfo={customerI} />,
      });
    };
    FetchCustomerInfo();
  }

  /**
   * Renders the class.
   * @returns a react component with the customer page
   */

/*
  render() {
    console.log(this.state.error);

    return (
      <section className='margin-right H100'>
        <Sidebar
          text={this.state.customerInfo && this.state.customerInfo.name ? this.state.customerInfo.name : 'Kundenavn'}
          buttons={this.buttons}
        />
        <div className='notSidebar'>{this.state.customerInfo ? this.state.pageState : <LoadingSymbol />}</div>
      </section>
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
      onClick: () =>
        this.setState({
          pageState: <SendMail customerID={[this.state.customerInfo._id]} />,
        }),
    },
    {
      text: 'Rediger',
      ID: 'edit',
      onClick: () => this.setState({ pageState: <CustomerEditPage customerInfo={this.state.customerInfo} /> }),
    },
  ];
}

export default CustomerPage;
*/
