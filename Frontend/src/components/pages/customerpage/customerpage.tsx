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
 * Subpages are also loaded/viewed from this component.
 */


// Main component in CustomerPage functional component.
const CustomerPage = () => {
  const { userType } = useContext(TypeContext);                   // Global context variable userType to determine access.

  const [pageState, setPageState] = useState(<LoadingSymbol />);  // Local state PageState to determine which page to display.
  const [customerInfo, setCustomerInfo] = useState(null);         // Local state customerInfo to store customerInfo.
  const [buttons, setButtons] = useState(null);                   // Local state buttons to store which buttons to show. 

  // UseEffect to fetch customers info.
  useEffect(() => {
    const FetchCustomerInfo = async () => {                      // FetchCustomerInfo to fetch this customers info.
      let customerI = null;                                      // Fetched customers variable.
      if (userType === 'Customer') {                             // If the current user is 'Customer', only show some pages.
        const customerSelf = await getEmployee();                // Gets info about itself. 
        customerI = await getCustomer(customerSelf.customerInformation[0]._id); //Fetches the only customer related, itself.
        setButtons('ButtonsRead');                               // Set buttons to only read access. 
      } else {
        customerI = await getCustomer(window.location.pathname.split('/')[2]);  // If not a usertype 'Customer', get full access.
        setButtons('Buttons');                                   // Set buttons to normal. Every button included. 
      }
      setCustomerInfo(customerI);                                // Sets customersinformation to fetched result. 
      setPageState(<CustomerInfoPage customerInfo={customerI} />); // Sets pagestate to startpage. Info. 
    };

    FetchCustomerInfo();                                         // Runs FetchCustomerInfo function.
  }, []);                                                        // Only excecutes when first rendered.

  // Returns buttonmenu and page depending on pagestate and if customerInfo is not empty.
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


// Function to set up Buttons in the sideMenu. Sets up every button for write permission. 
const Buttons = ({ setPageState }, { customerInfo }) => {   // Gets setPageState to update onclick and customerInfo
  const buttons: SBElementProps = [                         //   that lines up info in CustomerInfoPage component. 
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

// Function to set up Buttons in the sideMenu. Sets up some buttons for read permission.
const ButtonsRead = ({ setPageState }, { customerInfo }) => {   // Gets setPageState to update onclick and customerInfo
  const buttonsRead: SBElementProps = [                         //   that lines up info in CustomerInfoPage component. 
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