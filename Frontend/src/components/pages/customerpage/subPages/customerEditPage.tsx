import React, { useState, useEffect } from 'react';
import { InputField, MultipleInputField, TextArea } from '../../../basicComp/inputField';
import { useForm, useFieldArray } from 'react-hook-form';
import { getAllSuppliers, getCustomersAndSuppliers, newCustomer } from '../../../../azure/api';
import { Select } from '../../../basicComp/inputField';
import { deleteCustomer } from '../../../../azure/api';

// import { Test } from '../../../../interfaces';

interface NameAndID {
  _id: string;
  name: string;
}

/**
 * A page for editing customers.
 * @returns a react component with the edit-customer page.
 */
function CustomerEditPage({ customerInfo }: any) {
  const [supplierArrayState, setSupplierArrayState] = useState<NameAndID[]>(null);

  useEffect(() => {
    const fetchAllSuppliers = async () => {
      let suppliersInfo = await getAllSuppliers();
      setSupplierArrayState(suppliersInfo);
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
      contact: {
        name: string;
        phone: number;
        mail: string;
      };
    }[];
  };

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

  // https://react-hook-form.com/api/usefieldarray
  const { fields: tagFields, append: tagAppend, remove: tagRemove } = useFieldArray({
    control,
    name: 'tags',
  });

  const { fields: suppleirFields, append: supplierAppend, remove: supplierRemove } = useFieldArray({
    control,
    name: 'suppliers',
  });
  console.log(suppleirFields);

  return (
    <div>
      <h1 className='color-dark heading'>{customerInfo ? 'Redigere kunden' : 'Ny kunde'}</h1>
      <form
        onSubmit={handleSubmit((data) => {
          console.log(data);

          newCustomer(
            customerInfo ? customerInfo._id : null,
            data.customerName,
            data.contactMail,
            data.contactPhone,
            data.contactName,
            data.suppliers,
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
          defaultValue={customerInfo && customerInfo.comment ? customerInfo.comment : ''}
          register={register('note')}
        />
        <TextArea
          labelText={'Referanser'}
          lableType={'text'}
          lableName={'reference'}
          placeholderText={'Referer til andre ting :)'}
          defaultValue={customerInfo && customerInfo.infoReference ? customerInfo.infoReference : ''}
          register={register('infoReference')}
        />
        <MultipleInputField text={'Tags'}>
          {tagFields.map(({ id }, index) => {
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
          {suppleirFields.map(({ id }, index, supplier) => {
            return (
              <div key={id}>
                <Select
                  register={register(`suppliers.${index}.id` as const)}
                  name={`suppliers[${index}].id`}
                  defaultOption={{ name: 'Velg leverandør', value: 'default' }}
                  defaultValue={supplier[index].id}
                  options={supplierArrayState?.map(({ name, _id }) => {
                    return { name: name, value: _id };
                  })}
                />
                <InputField
                  labelText={'Navn '}
                  lableType={'text'}
                  lableName={`suppliers[${index}].name`}
                  register={register(`suppliers.${index}.contact.name` as const)}
                  defaultValue={customerInfo.suppliers[index]?.contact?.name}
                />
                <InputField
                  labelText={'Telefon '}
                  lableType={'text'}
                  lableName={`suppliers[${index}].phone`}
                  register={register(`suppliers.${index}.contact.phone` as const)}
                  defaultValue={customerInfo.suppliers[index]?.contact?.phone}
                />
                <InputField
                  labelText={'Mail '}
                  lableType={'text'}
                  lableName={`suppliers[${index}].mail`}
                  register={register(`suppliers.${index}.contact.mail` as const)}
                  defaultValue={customerInfo.suppliers[index]?.contact?.mail}
                />
                <button onClick={() => supplierRemove(index)}>x</button>
              </div>
            );
          })}
          <button type='button' onClick={() => supplierAppend({})}>
            Legg til leverandør
          </button>
        </MultipleInputField>

        {/* Delete button */}
        {customerInfo ? (
          <button
            type='button'
            onClick={() => {
              //popup-window asking the user if they want to delete the customer
              let respond = window.confirm('Er du sikker på at du vil slette kunden?');

              // Yes, delete customer
              if (respond) {
                console.log('Kunde slettet');
                deleteCustomer(customerInfo._id);
              }
              // No, dont delete customer
              else {
                console.log('Kunde ikke slettet');
              }
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
