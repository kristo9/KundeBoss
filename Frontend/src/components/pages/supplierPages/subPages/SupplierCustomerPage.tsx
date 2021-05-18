// Libraries
import { useContext } from 'react';

// Components
import { DisplayCustSupInfo } from '../../../basicComp/display';

// Context
import { LanguageContext } from '../../../../Context/language/LangContext';

// CSS
import '../../../basicComp/basic.css';

/**
 * Displayes a list with the suppliers.
 * @param {any} custInfo information about the cutomer.
 * @returns a react component with the customer-supplier page
 */
function SupplierCustomerPage({ supplierInfo }: any) {
  const { dictionary } = useContext(LanguageContext);
  return (
    <div>
      <h1 className='color-dark heading'>{dictionary.supplier.customers}</h1>
      <DisplayCustomer customers={supplierInfo.customers} />
    </div>
  );
}

/**
 * Displays some information about the suppliers.
 * @param {any} suppliers information about the suppliers.
 * @returns a react component with the supplier information.
 */
function DisplayCustomer(props: { customers: any }) {
  const { dictionary } = useContext(LanguageContext);
  //the supplier-data are loaded/available
  if (props.customers) {
    //the customer doen't hava any suppliers
    if (props.customers.length === 0) {
      return <div>{dictionary.supplier.noCustomer}</div>;
    }
    //The customer have suppliers
    return (
      <div>
        {props.customers.map((customer) => (
          <DisplayCustSupInfo
            key={customer?._id}
            gotoPage={'/customerpage/' + customer?._id?.toString()}
            name={customer.name}
            contactName={customer?.contact?.name}
            contactMail={customer?.contact?.mail}
            contactPhone={customer?.contact?.phone}
          />
        ))}
      </div>
    );
  }
}

export default SupplierCustomerPage;
