import { useContext } from 'react';
import { InputField, MultipleInputField, TextArea } from '../../../basicComp/inputField';
import { useForm } from 'react-hook-form';
import { deleteSupplier, newSupplier } from '../../../../azure/api';

import { LanguageContext } from '../../../../Context/language/LangContext';

import '../../../basicComp/sendMail.css';
import '../../../basicComp/basic.css';

/**
 * @desc Modyfy a suppliers data.
 * @param supplierInfo Default values about the supplier
 * @returns React component
 */
function SupplierEditPage({ supplierInfo }: any) {
  const { dictionary } = useContext(LanguageContext);

  type FormValues = {
    supplierName: string;
    contactName: string;
    contactPhone: number;
    contactMail: string;
    note: string;
  };

  //creates the useform variables
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>();

  return (
    <div>
      <h1 className='color-dark heading'>
        {supplierInfo ? dictionary.supplier.editSupplier : dictionary.supplier.newSupplier}
      </h1>
      <form
        onSubmit={handleSubmit((data) => {
          newSupplier(
            supplierInfo ? supplierInfo._id : null,
            data.supplierName,
            data.contactMail,
            data.contactPhone,
            data.contactName,
            data.note
          );
        })}
      >
        <InputField
          labelText={dictionary.name}
          lableType={'text'}
          lableName={'name'}
          placeholderText={dictionary.sppliersName}
          defaultValue={supplierInfo && supplierInfo.name ? supplierInfo.name : ''}
          register={register('supplierName')}
        />

        <MultipleInputField text={dictionary.contactPerson}>
          <InputField
            labelText={dictionary.name}
            lableType={'text'}
            lableName={'contactName'}
            placeholderText={dictionary.conatctName}
            defaultValue={
              supplierInfo && supplierInfo.contact && supplierInfo.contact.name ? supplierInfo.contact.name : ''
            }
            register={register('contactName')}
          />
          <InputField
            labelText={dictionary.phone}
            lableType={'tel'}
            lableName={'phone'}
            placeholderText={dictionary.conatctPhone}
            defaultValue={
              supplierInfo && supplierInfo.contact && supplierInfo.contact.phone ? supplierInfo.contact.phone : ''
            }
            register={register('contactPhone')}
          />
          <InputField
            labelText={dictionary.mail}
            lableType={'email'}
            lableName={'contactMail'}
            placeholderText={dictionary.conatctMail}
            defaultValue={
              supplierInfo && supplierInfo.contact && supplierInfo.contact.mail ? supplierInfo.contact.mail : ''
            }
            register={register('contactMail')}
          />
        </MultipleInputField>

        <TextArea
          labelText={dictionary.note}
          lableType={'text'}
          lableName={'note'}
          placeholderText={dictionary.supplier.note}
          defaultValue={supplierInfo && supplierInfo.note ? supplierInfo.note : ''}
          register={register('note')}
        />

        {/*  */}
        <div className='small-margin-over'>
          <button type='reset' className='editButton'>
            {dictionary.reset}
          </button>
          <button type='submit' className='editButton'>
            {supplierInfo ? dictionary.supplier.editSupplier : dictionary.supplier.newSupplier}
          </button>

          {/* Delete button */}
          {supplierInfo ? (
            <button
              type='button'
              className='editButton'
              onClick={() => {
                //popup-window asking the user if they want to delete the customer
                let respond = window.confirm('Er du sikker på at du vil slette kunden?');

                // Yes, delete customer
                if (respond) {
                  console.log('Kunde slettet');
                  deleteSupplier(supplierInfo._id);
                }
                // No, dont delete customer
                else {
                  console.log('Kunde ikke slettet');
                }
              }}
            >
              {dictionary.supplier.deleteSupplier}
            </button>
          ) : null}
        </div>
      </form>
    </div>
  );
}

export default SupplierEditPage;
