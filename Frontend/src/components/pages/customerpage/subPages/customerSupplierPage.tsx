import { useHistory } from 'react-router-dom';
import { DisplayCustSupInfo } from '../../../basicComp/display';

/**
 * Displayes a list with the suppliers.
 * @param {any} custInfo information about the cutomer.
 * @returns a react component with the customer-supplier page
 */
function CustomerSupplierPage({ customerInfo, customer }: any) {
  return (
    <div>
      <h1 className='color-dark heading'>Leverandører</h1>
      <DisplaySupplier suppliers={customerInfo.suppliers} customer={customer} />
    </div>
  );
}

/**
 * Displays some information about the suppliers.
 * @param {any} suppliers information about the suppliers.
 * @returns a react component with the supplier information.
 */
function DisplaySupplier(props: { suppliers: any; customer: boolean }) {
  //the supplier-data are loaded/available
  if (props.suppliers) {
    //the customer doen't hava any suppliers
    if (props.suppliers.length === 0) {
      return <div>Denne kunden har ingen leverandører</div>;
    }
    //the customer have suppliers
    return (
      <div>
        {props.suppliers.map((supplier) => (
          <DisplayCustSupInfo
            gotoPage={'/supplierpage/' + supplier.id.toString()}
            name={supplier.name}
            contactName={supplier.contact.name}
            contactMail={supplier.contact.mail}
            contactPhone={supplier.contact.phone}
          />
        ))}
      </div>
    );
  }
}

export function ContactPersonInfo() {
  return <div></div>;
}

export default CustomerSupplierPage;
