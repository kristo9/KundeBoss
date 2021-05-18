// Libraries
import { useContext } from 'react';

// Components
import { DisplayCustSupInfo } from '../../../basicComp/display';

// Context
import { LanguageContext } from '../../../../Context/language/LangContext';
import { dictionaryList } from '../../../../Context/language/LangDir';

/**
 * Displayes a list with the suppliers.
 * @param {any} custInfo information about the cutomer.
 * @returns a react component with the customer-supplier page
 */

 // CustomerSupplierPage main function.
const CustomerSupplierPage = ({ customerInfo, customer }: any) => {
  const { dictionary } = useContext(LanguageContext)
  return (
    <div>
      <h1 className='color-dark heading'>{dictionary.suppliers}</h1>
      <DisplaySupplier suppliers={customerInfo.suppliers} customer={customer} />  {/* Lists information about suppliers*/}
    </div>
  );
}

/**
 * Displays some information about the suppliers.
 * @param {any} suppliers information about the suppliers.
 * @returns a react component with the supplier information.
 */
const DisplaySupplier =(props: { suppliers: any; customer: boolean }) => {
  const { dictionary } = useContext(LanguageContext)
  //the supplier-data are loaded/available
  if (props.suppliers) {
    //the customer doen't hava any suppliers
    if (props.suppliers.length === 0) {
    return <div>{dictionary.noSuppliers}</div>;
    }
    //the customer have suppliers
    return (
      <div>
        {props.suppliers.map((supplier) => (
          <DisplayCustSupInfo
            key={supplier.id}
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

export default CustomerSupplierPage; // Exports CustomerSupplierPage function as main functional component
