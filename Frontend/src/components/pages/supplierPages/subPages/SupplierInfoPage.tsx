import { useContext } from 'react';
import { LanguageContext } from '../../../../Context/language/LangContext';

// CSS
import '../../../basicComp/basic.css';
import { DisplayTextAndInfo, ContactPersonInfo } from '../../../basicComp/display';

/**
 * Displayes information about the supplier.
 * @param {any} supplierInfo contains all the information about the supplier being displayed.
 * @returns a react-component
 */
export function SupplierInfoPage({ supplierInfo }: any) {
  const { dictionary } = useContext(LanguageContext);

  return (
    <div>
      <h1 className='color-dark heading'>{dictionary.information}</h1>
      <div className='displayInfoDiv'>
        <DisplayTextAndInfo text={dictionary.name} information={supplierInfo.name} altText={dictionary.missing} />
      </div>
      <ContactPersonInfo
        name={supplierInfo.contact.name}
        mail={supplierInfo.contact.mail}
        phone={supplierInfo.contact.phone}
      />
      <div className='displayInfoDiv'>
        <DisplayTextAndInfo text={dictionary.note} information={supplierInfo.comment} altText={dictionary.missing} />
      </div>
    </div>
  );
}

export default SupplierInfoPage;
