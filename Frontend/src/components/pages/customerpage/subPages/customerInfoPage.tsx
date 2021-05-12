import react from 'react';

import { DisplayTextAndInfo, ContactPersonInfo } from '../../../basicComp/display';
import '../../../basicComp/basic.css';

/**
 * Displayes the customer information.
 * @param {any} customerInfo contains all the information about the customer being displayed.
 * @returns a react-component with the customer information.
 */
export function CustomerInfoPage({ customerInfo }: any) {
  return (
    <div>
      <h1 className='color-dark heading'>Infomasjon</h1>
      <div className='displayInfoDiv'>
        <DisplayTextAndInfo text={'Navn'} information={customerInfo.name} altText={'Mangler navn'} />
      </div>
      <ContactPersonInfo
        name={customerInfo.contact.name}
        mail={customerInfo.contact.mail}
        phone={customerInfo.contact.phone}
      />
      <DisplayTags tags={customerInfo.tags} />

      <div className='displayInfoDiv'>
        <DisplayTextAndInfo text={'Notat'} information={customerInfo.comment} altText={'Kunden har ikke notat'} />
      </div>

      <div className='displayInfoDiv'>
        <DisplayTextAndInfo
          text={'Referanser'}
          information={customerInfo.infoReference}
          altText={'Kunden har ikke referanser'}
        />
      </div>
    </div>
  );
}

/**
 * Displayes the tags provided.
 * @param {any} tags array of tags.
 * @returns a react component with the tags.
 */
function DisplayTags(props: { tags: any }) {
  return (
    <div className='displayInfoDiv'>
      <h3>Tags</h3>
      {props?.tags ? (
        <ul className='listStyle addMarginLeft'>
          {props.tags.map((tag) => (
            <li key={tag}>{tag}</li>
          ))}
        </ul>
      ) : (
        <p>Denne kunden har ingen tags</p>
      )}
    </div>
  );
}
