import React, { useState, useEffect } from 'react';
import { sendMailCustomer, getCustomersAndSuppliers } from '../../../../azure/api';
import { Checkbox, InputField, MultipleInputField, Select, TextArea } from '../../../basicComp/inputField';
import { useForm, useFieldArray, useWatch } from 'react-hook-form';

interface NameAndID {
  name: string;
  _id: string;
}

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

      let suppliers = allCustomerAndSupplierIDs.customers.filter(({ customer }) => {
        return supplierIDs === customer._id;
      })[0]?.customer?.suppliers;

      return (
        <span>
          {suppliers?.map((supplier, supIndex) => {
            return (
              <span key={supplier._id}>
                <Checkbox
                  key={supplier._id}
                  labelText={supplier.name}
                  // lableType={'checkbox'}
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
      return <div>noe</div>;
    }
  };

  useEffect(() => {
    const fetchAllCustomerAndSuppliers = async () => {
      // gets the complete list of customers and suppliers
      let customersAndSuppliers = await getCustomersAndSuppliers();
      setAllCustomerAndSupplierIDs({ customers: customersAndSuppliers });
      setSelectedCustomerIDs({ customerID: props.customerID });

      setValue(
        'receivers',

        customersAndSuppliers
          .filter(({ customer }) => {
            var match = false;
            props.customerID.map((id) => {
              if (customer._id === id) {
                match = true;
              }
            });
            return match;
          })
          .map(({ customer }) => {
            return {
              customerID: customer._id,
              suppliersIDs: customer.suppliers.map((supplier) => {
                return supplier._id;
              }),
            };
          })
      );
    };

    fetchAllCustomerAndSuppliers();
  }, []);

  // https: react-hook-form.com/api/usefieldarray
  const { fields, append, remove } = useFieldArray({
    control: control,
    name: 'receivers',
  });

  function Test() {
    if (allCustomerAndSupplierIDs && selectedCustomerIDs) {
      return (
        <div>
          {selectedCustomerIDs.customerID.map((id, custIndex) => {
            var { customer } = allCustomerAndSupplierIDs.customers.find(({ customer }) => {
              return customer._id === id;
            });

            return (
              // customer checkbox
              <div key={id}>
                <Checkbox
                  labelText={customer.name}
                  // lableType={'checkbox'}
                  lableName={customer._id}
                  register={register(`receivers.${custIndex}.customerID` as const)}
                  defaultValue={true}
                  value={customer._id}
                />

                {customer.suppliers.map((supplier, supIndex) => {
                  return (
                    <Checkbox
                      key={supplier._id}
                      labelText={supplier.name}
                      // lableType={'checkbox'}
                      lableName={supplier._id + custIndex}
                      register={register(`receivers.${custIndex}.suppliersIDs.${supIndex}` as const)}
                      defaultValue={false}
                      value={supplier._id}
                    />
                  );
                })}
              </div>
            );
          })}
        </div>
      );
    } else {
      return <div>no</div>;
    }
  }

  return (
    <div>
      <h1>Send Mail</h1>

      <form
        onSubmit={handleSubmit((data) => {
          // let promisses = [];
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
              console.log(reciver);
              console.log(supplierIDs);

              //     promisses.push(
              //       sendMailCustomer(
              //         selectedCustomerIDs.customerID[index],
              //         typeof reciver.customerID == 'string',
              //         data.text,
              //         data.subject,
              //         supplierIDs
              //       )
              //     );
            }
          });

          // // exevutes all the promisses (send all the mails)
          // promisses.forEach(async (propmis) => {
          //   let result = await propmis;
          //   console.log(result);
          //   // if (result.status === 200) {
          //   //   console.log('mail sendt');
          //   // }
          // });
        })}
      >
        <InputField
          labelText={'Emne'}
          lableName={'subject'}
          lableType={'text'}
          register={register('subject', { required: true })}
        />

        {/* <label htmlFor='receiver'>Til </label>
        <input {...register('receiver', { required: true })} id='receiver'></input> */}

        <label htmlFor='text'>Text </label>
        <input {...register('text', { required: true })} id='text' />

        {/* <Test /> */}

        <MultipleInputField text={'Mottagere'}>
          {/* Verdi i field array oppdateres ikke før rerender  */}
          {fields.map(({ id, customerID }, custIndex) => {
            return (
              <div key={id}>
                <button type='button' onClick={() => remove(custIndex)}>
                  remove
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

                <SupplierSelecter
                  control={control}
                  register={register}
                  index={custIndex}
                  customerID={getValues(`receivers.${custIndex}.customerID` as const)}
                />

                {/* supplierIDs={suppliersIDs} */}

                {/* <select name={'TestSelect'} {...register(`receivers.${custIndex}.customerID` as const)}>
                  <option value={'default'}>velg</option>
                  {allCustomerAndSupplierIDs.customers.map(({ customer }) => {
                    return (
                      <option key={customer._id} value={customer._id}>
                        {customer.name}
                      </option>
                    );
                  })}
                </select> */}

                {/* <Checkbox
                  lableName={`receivers.${custIndex}.suppliersIDs.0`}
                  labelText={'test'}
                  register={register(`receivers.${custIndex}.suppliersIDs` as const)}
                  value={'testvalue'}
                  defaultValue={true}
                />
                <Checkbox
                  lableName={`receivers.${custIndex}.suppliersIDs.1`}
                  labelText={'test2'}
                  register={register(`receivers.${custIndex}.suppliersIDs` as const)}
                  value={'testvalue2'}
                  defaultValue={false}
                /> */}
              </div>
            );
          })}

          <button type='button' onClick={() => append({})}>
            Legg til mottager
          </button>
        </MultipleInputField>

        <button type='submit'>Send</button>
      </form>
    </div>
  );
}

export default SendMail;
