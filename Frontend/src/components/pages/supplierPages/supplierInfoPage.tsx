// CSS
import '../../basicComp/basic.css';

/**
 * Displayes the customer information.
 * @param {any} customerInfo contains all the information about the customer being displayed.
 * @returns a react-component with the customer information.
 */
export function SupplierInfoPage({ supplierInfo }: any) {
  return (
    <div>
      <h1 className='color-dark heading'>Infomasjon</h1>
      <DisplayTextAndInfo text={'Navn'} information={supplierInfo.name} />
      <ContactPersonInfo
        name={supplierInfo.contact.name}
        mail={supplierInfo.contact.mail}
        phone={supplierInfo.contact.phone}
      />
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
    <p>
      {props.text}: {props.information}
    </p>
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
    <div style={{ background: 'red' }}>
      <h3>Kontaktperson</h3>
      <div style={{ paddingLeft: '250 px' }}>
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
  //the customer doesn't have any tags, display a "error"-message
  if (props.tags.length === 0) {
    return (
      <div>
        <h3>Tags</h3>
        <p>Denne kunden har ingen tags</p>
      </div>
    );
  }
  //the customer have tags, display them
  return (
    <div>
      <h3>Tags</h3>
      {props.tags.map((tag) => (
        <p key={tag}>{tag}</p>
      ))}
    </div>
  );
}

export default SupplierInfoPage;
