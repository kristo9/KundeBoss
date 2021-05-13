import React from 'react';
import { useHistory } from 'react-router-dom';

export function CustomerOrSupplierOverview(props: {
  name: string;
  contactName: string;
  contactEmail: string;
  contactPhone: number;
}) {
  return (
    <div className='displayInfoDiv'>
      <h2>props.name</h2>

      <div className='addMarginLeft'>
        <DisplayTextAndInfo text={'Navn'} information={props.contactName} altText={'Mangler'} />
        <DisplayTextAndInfo text={'Telefon'} information={props.contactPhone} altText={'Mangler'} />
        <DisplayTextAndInfo text={'Mail'} information={props.contactEmail} altText={'Mangler'} />
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
  return (
    <div className='displayInfoDiv'>
      <h3>Kontaktperson</h3>
      <div className='addMarginLeft'>
        <DisplayTextAndInfo text={'Navn'} information={props.name} altText={'Mangler'} />
        <DisplayTextAndInfo text={'Telefon'} information={props.phone} altText={'Mangler'} />
        <DisplayTextAndInfo text={'Mail'} information={props.mail} altText={'Mangler'} />
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
        <DisplayTextAndInfo text={'Navn'} information={props.contactName} altText={'Mangler'} />
        <DisplayTextAndInfo text={'Telefon'} information={props.contactPhone} altText={'Mangler'} />
        <DisplayTextAndInfo text={'Mail'} information={props.contactMail} altText={'Mangler'} />
      </div>
    </div>
  );
}
