import { InputField, MultipleInputField, TextArea } from '../../../basicComp/inputField';
import { useForm, useFieldArray } from 'react-hook-form';
import { newSupplier } from '../../../../azure/api';

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
      <h1>{supplierInfo ? 'Redigere leverandør' : 'Ny leverandør'}</h1>
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

        {/* <TextArea
          labelText={'Referanser'}
          lableType={'text'}
          lableName={'reference'}
          placeholderText={'Referer til andre ting :)'}
          defaultValue={supplierInfo && supplierInfo.note ? supplierInfo.note : ''}
          register={register('infoReference')}
        /> */}

        <p>kunder []</p>

        {supplierInfo ? (
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
        <button type='reset'>Reset</button>
      </form>
    </div>
  );
}

export default SupplierEditPage;
