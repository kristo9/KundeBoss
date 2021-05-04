import { ContactPersonInfo } from './customerInfoPage';
import { useHistory } from 'react-router-dom';

/**
 * Displayes a list with the suppliers.
 * @param {any} custInfo information about the cutomer.
 * @returns a react component with the customer-supplier page
 */
function CustomerSupplierPage({ customerInfo }: any) {
  return (
    <div>
      <h1>Her er det Leverandører</h1>
      <p>
        <DisplaySupplier suppliers={customerInfo.suppliers} />
      </p>
    </div>
  );
}

/**
 * Displays some information about the suppliers.
 * @param {any} suppliers information about the suppliers.
 * @returns a react component with the supplier information.
 */
function DisplaySupplier(props: { suppliers: any }) {
  let history = useHistory();
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
          <div
            onClick={() => {
              history.push('/supplierpage/' + supplier.id.toString());
            }}
          >
            <ContactPersonInfo
              key={supplier?.id?.toString()}
              name={supplier?.contact?.name}
              mail={supplier?.contact?.mail}
              phone={supplier?.contact?.phone}
            />
          </div>
        ))}
      </div>
    );
  }
}

export default CustomerSupplierPage;