import { InputField, MultipleInputField, TextArea } from '../../../basicComp/inputField';
import { useForm, useFieldArray } from 'react-hook-form';
import { deleteSupplier, newSupplier } from '../../../../azure/api';

function SupplierEditPage({ supplierInfo }: any) {
  type FormValues = {
    supplierName: string;
    contactName: string;
    contactPhone: number;
    contactMail: string;
    note: string;
    // infoReference: string; // den skal nok fjernes
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<FormValues>();

  return (
    <div>
      <h1 className='color-dark heading'>{supplierInfo ? 'Redigere leverandør' : 'Ny leverandør'}</h1>
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
          labelText={'Navn'}
          lableType={'text'}
          lableName={'name'}
          placeholderText={'Bedriftens navn'}
          defaultValue={supplierInfo && supplierInfo.name ? supplierInfo.name : ''}
          register={register('supplierName')}
        />

        <MultipleInputField text='Kontaktperson'>
          <InputField
            labelText={'Navn'}
            lableType={'text'}
            lableName={'contactName'}
            placeholderText={'Kontaktpersonens navn'}
            defaultValue={
              supplierInfo && supplierInfo.contact && supplierInfo.contact.name ? supplierInfo.contact.name : ''
            }
            register={register('contactName')}
          />
          <InputField
            labelText={'Telfon'}
            lableType={'tel'}
            lableName={'contactPhone'}
            placeholderText={'Kontaktpersonens tlf'}
            defaultValue={
              supplierInfo && supplierInfo.contact && supplierInfo.contact.phone ? supplierInfo.contact.phone : ''
            }
            register={register('contactPhone')}
          />
          <InputField
            labelText={'Epost'}
            lableType={'email'}
            lableName={'contactMail'}
            placeholderText={'Kontaktpersonens mail'}
            defaultValue={
              supplierInfo && supplierInfo.contact && supplierInfo.contact.mail ? supplierInfo.contact.mail : ''
            }
            register={register('contactMail')}
          />
        </MultipleInputField>

        <TextArea
          labelText={'Notat'}
          lableType={'text'}
          lableName={'note'}
          placeholderText={'Notat om kunden'}
          defaultValue={supplierInfo && supplierInfo.note ? supplierInfo.note : ''}
          register={register('note')}
        />

        <div className='small-margin-over'>
          <button type='reset' className='editButton'>
            Reset
          </button>
          <button type='submit' className='editButton'>
            {supplierInfo ? 'Rediger bruker' : 'Lag bruker'}
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
              Slett kunde
            </button>
          ) : null}
        </div>

        {/* {supplierInfo ? (
          <button
            onClick={() => {
              //slett leverandør funksjon her (er du sikker boks?)
            }}
          >
            Slett leverandør
          </button>
        ) : (
          ''
        )}
        <button type='submit'>{supplierInfo ? 'Rediger leverandør' : 'Lag leverandør'}</button>
        <button type='reset'>Reset</button> */}
      </form>
    </div>
  );
}

export default SupplierEditPage;
