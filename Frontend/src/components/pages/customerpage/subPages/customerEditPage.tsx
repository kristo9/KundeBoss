import React, { useState, useEffect } from 'react';
import { InputField, MultipleInputField, TextArea } from '../../../basicComp/inputField';
import { useForm, useFieldArray } from 'react-hook-form';
import { getCustomersAndSuppliers, newCustomer } from '../../../../azure/api';

/**
 * A page for editing customers.
 * @returns a react component with the edit-customer page.
 */
function CustomerEditPage({ customerInfo }: any) {
  const [supplierArrayState, setSupplierArrayState] = useState(null);

  useEffect(() => {
    const fetchAllSuppliers = async () => {
      let customersAndSuppliers = await getCustomersAndSuppliers();
    };

    fetchAllSuppliers();
  }, []);

  type FormValues = {
    customerName: string;
    contactName: string;
    contactPhone: number;
    contactMail: string;
    note: string;
    infoReference: string;
    tags: { tag: string }[];
    suppliers: {
      id: string;
      name: string;
      phone: number;
      mail: string;
    }[];
  };

  console.log(customerInfo);

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<FormValues>(
    customerInfo //if customerInfo has data, add the tags
      ? {
          defaultValues: {
            suppliers: customerInfo.suppliers,
            tags: customerInfo.tags,
          },
        }
      : {}
  );

  console.log(customerInfo.suppliers);
  console.log(control);

  // https://react-hook-form.com/api/usefieldarray
  const { fields: tagFields, append: tagAppend, remove: tagRemove } = useFieldArray({
    control,
    name: 'tags',
  });

  const { fields: suppleirFields, append: supplierAppend, remove: supplierRemove } = useFieldArray({
    control,
    name: 'suppliers',
  });

  return (
    <div>
      <h1>{customerInfo ? 'Redigere kunden' : 'Ny kunde'}</h1>
      <form
        onSubmit={handleSubmit((data) => {
          console.log(data);

          //   newCustomer(
          //     customerInfo ? customerInfo._id : null,
          //     data.customerName,
          //     data.contactMail,
          //     data.contactPhone,
          //     data.contactName,
          //     null,
          //     getTagsArray(data.tags),
          //     data.note,
          //     data.infoReference
          //   );
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
          {tagFields.forEach(({ id }, index) => {
            return (
              <div key={id}>
                <InputField
                  labelText={'Tag ' + (index + 1)}
                  lableType={'text'}
                  lableName={`tags[${index}].tag`}
                  register={register(`tags.${index}.tag` as const)}
                  defaultValue={customerInfo.tags[index]}
                />
                <button onClick={() => tagRemove(index)}>x</button>
              </div>
            );
          })}

          <button type='button' onClick={() => tagAppend({})}>
            Legg til tag
          </button>
        </MultipleInputField>

        <MultipleInputField text={'Leverandører'}>
          {suppleirFields.map(({ id }, index) => {
            return (
              <div key={id}>
                <InputField
                  labelText={'Leverandør ' + (index + 1)}
                  lableType={'text'}
                  lableName={`suppliers[${index}].id`}
                  register={register(`suppliers.${index}.id` as const)}
                  defaultValue={customerInfo.suppliers[index]?.id}
                />
                <InputField
                  labelText={'Navn '}
                  lableType={'text'}
                  lableName={`suppliers[${index}].name`}
                  register={register(`suppliers.${index}.name` as const)}
                  defaultValue={customerInfo.suppliers[index]?.name}
                />
                <InputField
                  labelText={'Telefon '}
                  lableType={'text'}
                  lableName={`suppliers[${index}].phone`}
                  register={register(`suppliers.${index}.phone` as const)}
                  defaultValue={customerInfo.suppliers[index]?.phone}
                />
                <InputField
                  labelText={'Mail '}
                  lableType={'text'}
                  lableName={`suppliers[${index}].mail`}
                  register={register(`suppliers.${index}.mail` as const)}
                  defaultValue={customerInfo.suppliers[index]?.mail}
                />
                <button onClick={() => supplierRemove(index)}>x</button>
              </div>
            );
          })}

          <button type='button' onClick={() => supplierAppend({})}>
            Legg til leverandør
          </button>
        </MultipleInputField>

        {customerInfo ? (
          <button
            onClick={() => {
              //slett kunde funksjon her (er du sikker boks?)
            }}
          >
            Slett kunde
          </button>
        ) : (
          ''
        )}
        <button type='submit'>{customerInfo ? 'Rediger bruker' : 'Lag bruker'}</button>
        <button type='reset'>Reset</button>
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
