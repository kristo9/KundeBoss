// Libraries
import { useContext } from 'react';
import { useHistory } from 'react-router-dom';

// Context
import { LanguageContext } from '../../Context/language/LangContext';

// Display customer or supplier overview.
export function CustomerOrSupplierOverview(props: {
  name: string; // Define incoming parameter types.
  contactName: string;
  contactEmail: string;
  contactPhone: number;
}) {
  const { dictionary } = useContext(LanguageContext);
  return (
    <div className='displayInfoDiv'>
      <h2>{props.name}</h2>

      <div className='addMarginLeft'>
        <DisplayTextAndInfo text={dictionary.name} information={props.contactName} altText={dictionary.missing} />
        <DisplayTextAndInfo text={dictionary.phone} information={props.contactPhone} altText={dictionary.missing} />
        <DisplayTextAndInfo text={dictionary.mail} information={props.contactEmail} altText={dictionary.missing} />
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
export function DisplayTextAndInfo(props: { text: string; information: any; altText: string }) {
  return (
    <div>
      <span style={{ display: 'inline-block', width: '5em' }}>
        <b>{props.text}: </b>
      </span>
      {props.information ? props.information : props.altText}
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
  const { dictionary } = useContext(LanguageContext);
  return (
    <div className='displayInfoDiv'>
      <h3>{dictionary.contactPerson}</h3>
      <div className='addMarginLeft'>
        <DisplayTextAndInfo text={dictionary.name} information={props.name} altText={dictionary.missing} />
        <DisplayTextAndInfo text={dictionary.phone} information={props.phone} altText={dictionary.missing} />
        <DisplayTextAndInfo text={dictionary.mail} information={props.mail} altText={dictionary.missing} />
      </div>
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
export function DisplayCustSupInfo(props: {
  name: string;
  contactName: string;
  contactPhone: number;
  contactMail: string;
  gotoPage: string;
}) {
  const { dictionary } = useContext(LanguageContext);
  let history = useHistory();

  return (
    <div className='displayInfoDiv'>
      <h3
        style={{ cursor: 'pointer' }}
        onClick={() => {
          if (props.gotoPage) {
            history.push(props.gotoPage);
          }
        }}
      >
        {props.name}
      </h3>

      <div className='addMarginLeft'>
        <DisplayTextAndInfo text={dictionary.name} information={props.contactName} altText={dictionary.missing} />
        <DisplayTextAndInfo text={dictionary.phone} information={props.contactPhone} altText={dictionary.missing} />
        <DisplayTextAndInfo text={dictionary.mail} information={props.contactMail} altText={dictionary.missing} />
      </div>
    </div>
  );
}
