import react from 'react';
import '../../../basicComp/basic.css';

/**
 * Displayes the customer information.
 * @param {any} customerInfo contains all the information about the customer being displayed.
 * @returns a react-component with the customer information.
 */
export function CustomerInfoPage({ customerInfo }: any) {
  let info = customerInfo.comment ? customerInfo.comment : 'Det er ingen notater om kunden';

  return (
    <div>
      <h1 className='color-dark'>Infomasjon</h1>
      <div className='displayInfoDiv'>
        <DisplayTextAndInfo text={'Navn'} information={customerInfo.name} />
      </div>
      <ContactPersonInfo
        name={customerInfo.contact.name}
        mail={customerInfo.contact.mail}
        phone={customerInfo.contact.phone}
      />
      <DisplayTags tags={customerInfo.tags} />

      <div className='displayInfoDiv'>
        <DisplayTextAndInfo text={'Notat'} information={info} />
      </div>
    </div>
  );
}

/**
 * Formates text and information.
 * @param {string} text is the text being displayed before the information.
 * @param {string} information is displayed after the information.
 * @returns A react component with the formated text.
 */
function DisplayTextAndInfo(props: { text: string; information: any }) {
  return (
    <div>
      <span style={{ display: 'inline-block', width: '5em' }}>
        <b>{props.text}: </b>
      </span>
      {props.information}
    </div>
  );
}

/**
 * Displayes the contactperson information.
 * @param {string} name the name of the contactperson.
 * @param {number} phone the phone number of the contactperson.
 * @param {string} mail the ontactpersons mail.
 * @returns a react component with the information.
 */
export function ContactPersonInfo(props: { name: string; phone: number; mail: string }) {
  return (
    <div className='displayInfoDiv'>
      <h3>Kontaktperson</h3>
      <div className='addMarginLeft'>
        <DisplayTextAndInfo text={'Navn'} information={props.name} />
        <DisplayTextAndInfo text={'Telefon'} information={props.phone} />
        <DisplayTextAndInfo text={'Mail'} information={props.mail} />
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
