// CSS
import '../../../basicComp/basic.css';
import { DisplayTextAndInfo, ContactPersonInfo } from '../../../basicComp/display';

/**
 * Displayes the customer information.
 * @param {any} customerInfo contains all the information about the customer being displayed.
 * @returns a react-component with the customer information.
 */

export function SupplierInfoPage({ supplierInfo }: any) {
  console.log(supplierInfo.name);
  return (
    <div>
      <h1 className='color-dark heading'>Infomasjon</h1>
      <div className='displayInfoDiv'>
        <DisplayTextAndInfo text={'Navn'} information={supplierInfo.name} altText={'Mangler'} />
      </div>
      <ContactPersonInfo
        name={supplierInfo.contact.name}
        mail={supplierInfo.contact.mail}
        phone={supplierInfo.contact.phone}
      />
      <div className='displayInfoDiv'>
        <DisplayTextAndInfo text={'Notat'} information={supplierInfo.comment} altText={'Kunden har ikke notat'} />
      </div>
    </div>
  );
}

export default SupplierInfoPage;
