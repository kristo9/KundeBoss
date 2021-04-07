import react from 'react';


/**
 * Displayes the customer information.
 * @param {any} customerInfo contains all the information about the customer being displayed.
 * @returns a react-component with the customer information.
 */
export function CustomerInfoPage({ customerInfo }: any) {
  return (
    <div>
      <h1>Infomasjon</h1>
      <DisplayTextAndInfo text={'Navn'} information={customerInfo.name} />
      <ContactPersonInfo
        name={customerInfo.contact.name}
        mail={customerInfo.contact.mail}
        phone={customerInfo.contact.phone}
      />
      <DisplayTags tags={customerInfo.tags} />
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
      {props.text}: {props.information}
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
    <div style={{ borderStyle: 'solid'}}>
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
        <div>Denne kunden har ingen tags</div>
      </div>
    );
  }
  //the customer have tags, display them
  return (
    <div>
      <h3>Tags</h3>
      {props.tags.map((tag) => (
        <div>
            <div key={tag}>{tag}</div>
        </div>
      ))}
    </div>
  );
}
