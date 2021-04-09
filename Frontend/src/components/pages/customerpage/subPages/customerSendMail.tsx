import React from 'react';
import { InputField, TextArea } from '../../../basicComp/inputField';

function SendMail({ customerInfo }: any) {
  return (
    <div>
      <h1>Send Mail</h1>
      <form>
        <InputField labelText={'Emne'} lableType={'text'} lableName={'name'} placeholderText={'Emne'} />
        <InputField
          labelText={'Til'}
          lableType={'text'}
          lableName={'to'}
          placeholderText={'Bedriftens navn'}
          defaultValue={
            customerInfo && customerInfo.contact && customerInfo.contact.mail ? customerInfo.contact.mail : ''
          }
        />
        <TextArea labelText={'Mail tekst'} lableType={'text'} lableName={'mailTekst'} placeholderText={'Mail tekst'} />
        <button type='submit'>Send</button>
      </form>
    </div>
  );
}

export default SendMail;
