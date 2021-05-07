import react from 'react';
import { ContactPersonInfo } from '../customerpage/subPages/customerInfoPage';

/**
 * Displayes a list with the suppliers.
 * @param {any} custInfo information about the cutomer.
 * @returns a react component with the customer-supplier page
 */
function SupplierCustomerPage({ supplierInfo }: any) {
  console.log(supplierInfo);
  return (
    <div>
      <h1 className='color-dark heading'>Her er det Kunder</h1>
      <p>
        <DisplayCustomers customers={supplierInfo.customers} />
      </p>
    </div>
  );
}

/**
 * Displays some information about the suppliers.
 * @param {any} suppliers information about the suppliers.
 * @returns a react component with the supplier information.
 */
function DisplayCustomers(props: { customers: any }) {
  //the customer doen't hava any suppliers
  if (props.customers.length === 0) {
    return <div>Denne Leverandøren har ingen kunder</div>;
  }
  //the customer have suppliers
  return (
    <div>
      {props.customers.map((customer) => (
        <ContactPersonInfo
          key={customer._id.toString()}
          name={customer.contact.name}
          mail={customer.contact.mail}
          phone={customer.contact.phone}
        />
      ))}
      {/* TODO: legge til tillegsinformasjon om kontaktpersonen til leverandør ? */}
    </div>
  );
}

export default SupplierCustomerPage;
