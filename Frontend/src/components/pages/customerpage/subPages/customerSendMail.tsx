import React, { useState, useEffect } from 'react';
import { sendMailCustomer, getCustomersAndSuppliers } from '../../../../azure/api';
import { Checkbox, InputField, MultipleInputField, Select, TextArea } from '../../../basicComp/inputField';
import { useForm, useFieldArray, useWatch } from 'react-hook-form';

//CSS
import '../../../basicComp/sendMail.css';

interface CustomerAndSupplierIDProp {
  customers: {
    customer: {
      name: string;
      _id: string;
      suppliers: {
        name: string;
        _id: string;
      }[];
    };
  }[];
}

interface customerIDProp {
  customerID: string[];
}

function SendMail(props: customerIDProp) {
  const [allCustomerAndSupplierIDs, setAllCustomerAndSupplierIDs] = useState<CustomerAndSupplierIDProp>(null);
  const [selectedCustomerIDs, setSelectedCustomerIDs] = useState<customerIDProp>(null);

  type FormValues = {
    subject: string;
    text: string;
    test: string;
    receivers: {
      customerID: string;
      includeCustomer: boolean; //TODO
      suppliersIDs: string[];
    }[];
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    setValue,
    getValues,
  } = useForm<FormValues>();

  const SupplierSelecter = ({ control, register, index, customerID }) => {
    const value = useWatch({
      control,
      name: `receivers.${index}.customerID`,
      defaultValue: { customerID },
    });

    if (allCustomerAndSupplierIDs) {
      let supplierIDs = getValues(`receivers.${index}.customerID` as const);

      let suppliers = allCustomerAndSupplierIDs?.customers?.filter(({ customer }) => {
        return supplierIDs === customer._id;
      })[0]?.customer?.suppliers;

      return (
        <span>
          {suppliers?.map((supplier, supIndex) => {
            return (
              <span key={supplier._id} style={{ whiteSpace: 'nowrap', paddingRight: '1em' }}>
                <Checkbox
                  key={supplier._id}
                  labelText={supplier.name}
                  lableName={supplier._id + index}
                  register={register(`receivers.${index}.suppliersIDs.${supIndex}` as const)}
                  defaultValue={false}
                  value={supplier._id}
                />
              </span>
            );
          })}
        </span>
      );
    } else {
      return null;
    }
  };

  useEffect(() => {
    const fetchAllCustomerAndSuppliers = async () => {
      // gets the complete list of customers and suppliers
      let customersAndSuppliers = await getCustomersAndSuppliers();
      console.log(customersAndSuppliers);
      setAllCustomerAndSupplierIDs({ customers: customersAndSuppliers });
      setSelectedCustomerIDs({ customerID: props.customerID });

      if (customersAndSuppliers) {
        setValue(
          'receivers',

          customersAndSuppliers
            ?.filter(({ customer }) => {
              var match = false;
              props.customerID?.map((id) => {
                if (customer._id === id) {
                  match = true;
                }
              });
              return match;
            })
            ?.map(({ customer }) => {
              return {
                customerID: customer._id,
                suppliersIDs: customer?.suppliers?.map((supplier) => {
                  return supplier._id;
                }),
              };
            })
        );
      }
    };

    fetchAllCustomerAndSuppliers();
  }, []);

  // https: react-hook-form.com/api/usefieldarray
  const { fields, append, remove } = useFieldArray({
    control: control,
    name: 'receivers',
  });

  return (
    <div>
      <h1 className='color-dark heading'>Send Mail</h1>

      <form
        onSubmit={handleSubmit((data) => {
          let promisses = [];
          let supplierIDs;

          //filtrer ut default fra customerID og false fra supplierIDs[]

          data.receivers.forEach((reciver, index) => {
            //removes false from the array
            supplierIDs = null;
            if (reciver.suppliersIDs) {
              supplierIDs = reciver.suppliersIDs.filter((supplier) => {
                return supplier;
              });
              if (supplierIDs.length === 0) {
                supplierIDs = null;
              }
            }

            // prepare all the mails in a promis-array
            if ((reciver.customerID && reciver.customerID != 'default') || supplierIDs) {
              console.log('Send mail');

              promisses.push(
                sendMailCustomer(
                  selectedCustomerIDs.customerID[index],
                  reciver.includeCustomer,
                  data.text,
                  data.subject,
                  supplierIDs
                )
              );
            }
          });

          console.log(promisses);
          // exevutes all the promisses (send all the mails)
          promisses.forEach(async (propmis) => {
            let result = await propmis;
            console.log(result);
            // if (result.status === 200) {
            //   console.log('mail sendt');
            // }
          });
        })}
      >
        <div className='displayInfoDiv inputField'>
          <InputField
            labelText={'Emne'}
            lableName={'subject'}
            lableType={'text'}
            register={register('subject', { required: true })}
          />
        </div>

        <div className='displayInfoDiv'>
          <MultipleInputField text={'Mottagere'}>
            {/* Verdi i field array oppdateres ikke før rerender  */}
            {fields.map(({ id, customerID }, custIndex) => {
              return (
                <div key={id}>
                  <div style={{ display: 'flex' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', marginRight: '2em' }}>
                      <div style={{ whiteSpace: 'nowrap' }}>
                        <button type='button' onClick={() => remove(custIndex)} className='removeButton'>
                          x
                        </button>

                        <Select
                          register={register(`receivers.${custIndex}.customerID` as const)}
                          name={`receicers${custIndex}`}
                          defaultOption={{ name: 'Velg kunde', value: 'default' }}
                          defaultValue={customerID}
                          options={allCustomerAndSupplierIDs?.customers?.map(({ customer }) => {
                            return { name: customer.name, value: customer._id };
                          })}
                        />
                      </div>
                      <div style={{ marginLeft: '2em' }}>
                        <Checkbox
                          labelText={'Inkluder kunde'}
                          lableName={'includeCustomer'}
                          register={register(`receivers.${custIndex}.includeCustomer` as const)}
                          defaultValue={true}
                          value={'true'}
                        />
                      </div>
                    </div>

                    <SupplierSelecter
                      control={control}
                      register={register}
                      index={custIndex}
                      customerID={getValues(`receivers.${custIndex}.customerID` as const)}
                    />
                  </div>
                  <hr className='mailHr'></hr>
                </div>
              );
            })}

            <button type='button' onClick={() => append({})} className='addButtonWhite'>
              <b>+</b> Legg til mottager
            </button>
          </MultipleInputField>
        </div>

        <TextArea
          labelText={'Text'}
          lableType={'text'}
          lableName={'text'}
          placeholderText={'Text til mottager'}
          defaultValue={''}
          register={register('text')}
        />

        <button type='submit' className='editButton'>
          Send
        </button>
      </form>
    </div>
  );
}

export default SendMail;
