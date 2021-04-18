import react from 'react';
import { InputField, MultipleInputField, TextArea } from '../../../basicComp/inputField';
import { useForm, useFieldArray } from 'react-hook-form';
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
    tags: { tag: string }[];
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<FormValues>({
    defaultValues: {
      tags: customerInfo.tags,
    },
  });

  // https://react-hook-form.com/api/usefieldarray
  const { fields, append, prepend, remove } = useFieldArray({
    control,
    name: 'tags',
  });

  return (
    <div>
      <h1>{customerInfo ? 'Redigere kunden' : 'Ny kunde'}</h1>
      <form
        onSubmit={handleSubmit((data) => {
          newCustomer(
            customerInfo ? customerInfo._id : null,
            data.customerName,
            data.contactMail,
            data.contactPhone,
            data.contactName,
            null,
            getTagsArray(data.tags),
            data.note,
            data.infoReference
          );
        })}
      >
        <InputField
          labelText={'Navn'}
          lableType={'text'}
          lableName={'name'}
          placeholderText={'Bedriftens navn'}
          defaultValue={customerInfo && customerInfo.name ? customerInfo.name : ''}
          register={register('customerName')}
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
            register={register('contactName')}
          />
          <InputField
            labelText={'Telfon'}
            lableType={'tel'}
            lableName={'contactPhone'}
            placeholderText={'Kontaktpersonens tlf'}
            defaultValue={
              customerInfo && customerInfo.contact && customerInfo.contact.phone ? customerInfo.contact.phone : ''
            }
            register={register('contactPhone')}
          />
          <InputField
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

        <TextArea
          labelText={'Notat'}
          lableType={'text'}
          lableName={'note'}
          placeholderText={'Notat om kunden'}
          defaultValue={customerInfo && customerInfo.note ? customerInfo.note : ''}
          register={register('note')}
        />

        <TextArea
          labelText={'Referanser'}
          lableType={'text'}
          lableName={'reference'}
          placeholderText={'Referer til andre ting :)'}
          defaultValue={customerInfo && customerInfo.note ? customerInfo.note : ''}
          register={register('infoReference')}
        />

        <MultipleInputField text={'Tags'}>
          {fields.map(({ id }, index) => {
            return (
              <div key={id}>
                <InputField
                  labelText={'Tag ' + (index + 1)}
                  lableType={'text'}
                  lableName={`tags[${index}].tag`}
                  register={register(`tags.${index}.tag` as const)}
                  defaultValue={customerInfo.tags[index]}
                />
                <button onClick={() => remove(index)}>x</button>
              </div>
            );
          })}

          <button type='button' onClick={() => append({})}>
            Legg til tag
          </button>
        </MultipleInputField>

        <p>Suppliers []</p>

        {/* {customerInfo ? <button>Slett kunde</button> : ''} */}
        <button type='submit'>{customerInfo ? 'Rediger bruker' : 'Lag bruker'}</button>
        {/* <button type='reset'>Reset</button> */}
      </form>
    </div>
  );
}

function getTagsArray(tags: any) {
  var outputArray = [];
  for (let element in tags) {
    console.log(tags[element].tag);
    if (tags[element].tag) {
      outputArray.push(tags[element].tag);
    }
  }

  return outputArray;
}

export default CustomerEditPage;
