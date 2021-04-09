import react from 'react';
import { InputField, MultipleInputField, TextArea } from '../../../basicComp/inputField';

/**
 * A page for editing customers.
 * @returns a react component with the edit-customer page.
 */
function CustomerEditPage({ customerInfo }: any) {
  return (
    <div>
      <h1>{customerInfo ? 'Redigere kunden' : 'Ny kunde'}</h1>
      <form>
        <InputField
          labelText={'Navn'}
          lableType={'text'}
          lableName={'name'}
          placeholderText={'Bedriftens navn'}
          defaultValue={customerInfo && customerInfo.name ? customerInfo.name : ''}
        />

        <MultipleInputField text='Kontaktperson'>
          <InputField
            labelText={'Navn'}
            lableType={'text'}
            lableName={'contactName'}
            placeholderText={'Kontaktpersonens navn'}
            defaultValue={
              customerInfo && customerInfo.contact && customerInfo.contact.name ? customerInfo.contact.name : ''
            }
          />
          <InputField
            labelText={'Telfon'}
            lableType={'tel'}
            lableName={'contactPhone'}
            placeholderText={'Kontaktpersonens tlf'}
            defaultValue={
              customerInfo && customerInfo.contact && customerInfo.contact.phone ? customerInfo.contact.phone : ''
            }
          />
          <InputField
            labelText={'Epost'}
            lableType={'email'}
            lableName={'contactMail'}
            placeholderText={'Kontaktpersonens mail'}
            defaultValue={
              customerInfo && customerInfo.contact && customerInfo.contact.mail ? customerInfo.contact.mail : ''
            }
          />
        </MultipleInputField>

        <TextArea
          labelText={'Notat'}
          lableType={'text'}
          lableName={'note'}
          placeholderText={'Notat om kunden'}
          defaultValue={customerInfo && customerInfo.note ? customerInfo.note : ''}
        />

        <button>+</button>

        {customerInfo ? <button>Slett kunde</button> : ''}
        <button type='submit'>{customerInfo ? 'Rediger bruker' : 'Lag bruker'}</button>
        <button type='reset'>Reset</button>
      </form>
    </div>
  );
}

export default CustomerEditPage;
