import { ContactPersonInfo } from './SupplierInfoPage';
import { useHistory } from 'react-router-dom';


/**
 * Displayes a list with the suppliers.
 * @param {any} custInfo information about the cutomer.
 * @returns a react component with the customer-supplier page
 */
function SupplierCustomerPage({ supplierInfo }: any) {
  return (
    <div>
      <h1>Her er det Kunder</h1>
      <p>
        <DisplayCustomer customers={supplierInfo.customers} />
      </p>
    </div>
  );
}

/**
 * Displays some information about the suppliers.
 * @param {any} suppliers information about the suppliers.
 * @returns a react component with the supplier information.
 */
function DisplayCustomer(props: { customers: any }) {
  let history = useHistory();
  //the supplier-data are loaded/available
  if (props.customers) {
    //the customer doen't hava any suppliers
    if (props.customers.length === 0) {
      return <div>Denne kunden har ingen leverandører</div>;
    }
    //the customer have suppliers
    return (
      <div>
        {props.customers.map((customer) => (
          <div onClick={() => { history.push('/customerpage/' + customer._id.toString()); }}>
            <ContactPersonInfo
              key={customer._id.toString()}
              name={customer.contact.name}
              mail={customer.contact.mail}
              phone={customer.contact.phone}
            />
          </div>
        ))}
      </div>
    );
  }
}

export default SupplierCustomerPage;

