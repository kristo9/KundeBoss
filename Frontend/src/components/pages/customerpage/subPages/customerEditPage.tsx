import react from 'react';
import { InputField1, MultipleInputField, TextArea1 } from '../../../basicComp/inputField';
import { useForm } from 'react-hook-form';
import { newCustomer } from '../../../../azure/api';

/**
 * A page for editing customers.
 * @returns a react component with the edit-customer page.
 */
function CustomerEditPage({ customerInfo }: any) {
  type FormValues = {
    customerName: string;
    contactName: string;
    contactPhone: number;
    contactMail: string;
    note: string;
    infoReference: string;
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>();

  return (
    <div>
      <h1>{customerInfo ? 'Redigere kunden' : 'Ny kunde'}</h1>
      <form
        onSubmit={handleSubmit((data) => {
          if (customerInfo) {
            alert(JSON.stringify(data));
            console.log('rediger kunde');
          } else {
            alert(JSON.stringify(data));
            console.log('Ny kunde');
            // newCustomer(
            //   data.customerName,
            //   data.contactMail,
            //   data.contactPhone,
            //   data.contactName,
            //   null,
            //   null,
            //   data.note,
            //   data.infoReference
            // );
          }
        })}
      >
        <InputField1
          labelText={'Navn'}
          lableType={'text'}
          lableName={'name'}
          placeholderText={'Bedriftens navn'}
          defaultValue={customerInfo && customerInfo.name ? customerInfo.name : ''}
          register={register('customerName')}
        />

        <MultipleInputField text='Kontaktperson'>
          <InputField1
            labelText={'Navn'}
            lableType={'text'}
            lableName={'contactName'}
            placeholderText={'Kontaktpersonens navn'}
            defaultValue={
              customerInfo && customerInfo.contact && customerInfo.contact.name ? customerInfo.contact.name : ''
            }
            register={register('contactName')}
          />
          <InputField1
            labelText={'Telfon'}
            lableType={'tel'}
            lableName={'contactPhone'}
            placeholderText={'Kontaktpersonens tlf'}
            defaultValue={
              customerInfo && customerInfo.contact && customerInfo.contact.phone ? customerInfo.contact.phone : ''
            }
            register={register('contactPhone')}
          />
          <InputField1
            labelText={'Epost'}
            lableType={'email'}
            lableName={'contactMail'}
            placeholderText={'Kontaktpersonens mail'}
            defaultValue={
              customerInfo && customerInfo.contact && customerInfo.contact.mail ? customerInfo.contact.mail : ''
            }
            register={register('contactMail')}
          />
        </MultipleInputField>

        <TextArea1
          labelText={'Notat'}
          lableType={'text'}
          lableName={'note'}
          placeholderText={'Notat om kunden'}
          defaultValue={customerInfo && customerInfo.note ? customerInfo.note : ''}
          register={register('note')}
        />

        <TextArea1
          labelText={'Referanser'}
          lableType={'text'}
          lableName={'reference'}
          placeholderText={'Referer til andre ting :)'}
          defaultValue={customerInfo && customerInfo.note ? customerInfo.note : ''}
          register={register('infoReference')}
        />
        <p>Tag []</p>
        <p>Suppliers []</p>

        {/* {customerInfo ? <button>Slett kunde</button> : ''} */}
        <button type='submit'>{customerInfo ? 'Rediger bruker' : 'Lag bruker'}</button>
        {/* <button type='reset'>Reset</button> */}
      </form>
    </div>
  );
}

export default CustomerEditPage;
