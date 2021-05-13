import React, { useEffect, useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { getAllCustomer, getEmployee, modifyEmployeeData } from '../../../../azure/api';
import { InputField, Select } from '../../../basicComp/inputField';

//CSS
import '../adminPage.css';
import '../../../basicComp/basic.css';

interface EmployeeRights {
  name: string;
  employeeId: string;
  admin: string;
  isCustomer: boolean;
  customerInformation: EmployPermissionForACustomer[];
}

interface EmployPermissionForACustomer {
  _id: string;
  name: string;
  permission: string;
}

const ViewRights = ({ adminData }: any) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<EmployeeRights[]>([]);

  // Searchfield logic
  const handleChange = (event) => {
    setSearchTerm(event.target.value);
  };
  useEffect(() => {
    const results = adminData.filter((employee) => employee.name.toLowerCase().includes(searchTerm.toLowerCase()));
    setSearchResults(results);
  }, [searchTerm]);

  const [customerData, setCustomerData] = useState(null);

  useEffect(() => {
    const fetchAllCustomers = async () => {
      let customers = await getAllCustomer();
      setCustomerData(customers);
    };

    fetchAllCustomers();
  }, []);

  return (
    <div>
      <h1 className='color-dark heading'>Rettigheter</h1>
      <div style={{ marginBottom: '4em' }}>
        {/* Searchfield */}
        <input
          style={{ float: 'right', marginBottom: '2em' }}
          className='search'
          type='text'
          placeholder='Søk'
          value={searchTerm}
          onChange={handleChange}
        ></input>
      </div>
      {/* Displayes all the employees and there rights */}
      <section className='employeeDisplay'>
        <ul>
          {searchResults.map((employee, index) =>
            !(employee.isCustomer || employee === null) ? (
              <li key={employee.employeeId} className='displayInfoDiv'>
                <EmployeRights
                  employeeId={employee.employeeId}
                  name={employee.name}
                  admin={employee.admin}
                  isCustomer={employee.isCustomer}
                  customerInformation={employee.customerInformation}
                  index={index}
                />
              </li>
            ) : null
          )}
        </ul>
      </section>
    </div>
  );

  function EmployeRights(props: EmployeeRights & { index: number }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <div>
        <div style={{ display: 'flex' }}>
          <button
            className='rotate90'
            style={{ height: '2em', marginRight: '0.5em' }}
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? '>' : '<'}
          </button>
          <h3>{props.name}</h3>
        </div>

        {!isOpen ? (
          <div>
            <p style={{ fontSize: '0.8em', margin: '0.1em' }}>{props.employeeId}</p>
            <p style={{ marginBottom: 0 }}>
              {props.admin === 'write'
                ? 'Admin skriv'
                : props.admin === 'read'
                ? 'Admin les'
                : 'Har ' + props.customerInformation.length + ' kunder'}
            </p>
          </div>
        ) : (
          <DisplayAndEditEmployeeRights
            employeeId={props.employeeId}
            isCustomer={props.isCustomer}
            name={props.name}
            admin={props.admin}
            customerInformation={props.customerInformation}
            index={props.index}
          />
        )}
      </div>
    );
  }

  function DisplayAndEditEmployeeRights(props: EmployeeRights & { index: number }) {
    const [isEditOpen, setEditIsOpen] = useState(false);

    // Form
    const { register: register, handleSubmit: handleSubmit, control: control } = useForm<EmployeeRights>({
      defaultValues: {
        employeeId: props.employeeId,
        name: props.name,
        admin: props.admin,
        customerInformation: props.customerInformation,
      },
    });

    const { fields: permissionField, append: permissionFieldAppend, remove: permissionFieldRemove } = useFieldArray({
      control,
      name: 'customerInformation',
    });

    return (
      <div>
        <button className='editButton' onClick={() => setEditIsOpen(!isEditOpen)}>
          {isEditOpen ? 'Avbryt' : 'Rediger'}
        </button>

        {!isEditOpen ? (
          <div>
            <p>{props.employeeId}</p>
            <ul>
              {props.customerInformation.map((customer) => {
                return (
                  <li key={customer._id}>
                    <b>{customer.name}</b>

                    <span> {customer.permission === 'write' ? 'skriv' : 'les'}</span>
                  </li>
                );
              })}
            </ul>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit((data) => {
              let adminPermission: string = data.admin === 'Ingen' ? 'null' : data.admin;

              modifyEmployeeData(
                data.employeeId,
                data.name,
                adminPermission,
                false,
                data.customerInformation.map((customerI) => {
                  return { id: customerI._id, permission: customerI.permission };
                })
              );
            })}
          >
            <InputField
              labelText={'Navn'}
              lableType={'text'}
              lableName={'name' + props.index}
              placeholderText={'Ansattes navn'}
              defaultValue={props.name}
              register={register('name')}
            />
            <div>
              Admin rettigheter
              <Select
                register={register('admin')}
                name={`admin`}
                defaultOption={{ name: 'Ingen', value: null }}
                defaultValue={props.admin === null ? 'null' : props.admin}
                options={[
                  { name: 'Les', value: 'read' },
                  { name: 'Skriv', value: 'write' },
                ]}
              />
            </div>

            {permissionField.map(({ id }, index, customerInfo) => {
              return (
                <div key={id}>
                  <button className='removeButton' onClick={() => permissionFieldRemove(index)}>
                    x
                  </button>
                  <Select
                    register={register(`customerInformation.${index}._id` as const)}
                    name={`customersInfo.${index}.customerInfo._id`}
                    defaultOption={{ name: 'Velg kunde', value: null }}
                    defaultValue={customerInfo[index]?._id}
                    options={customerData?.map(({ name, _id }) => {
                      return { name: name, value: _id };
                    })}
                  />
                  <Select
                    register={register(`customerInformation.${index}.permission` as const)}
                    name={`customersInfo.${index}.customerInfo.permission`}
                    defaultOption={{ name: 'les', value: 'read' }}
                    defaultValue={customerInfo[index].permission}
                    options={[{ name: 'skriv', value: 'write' }]}
                  />
                </div>
              );
            })}
            <button className='addButton' type='button' onClick={() => permissionFieldAppend({})}>
              <b>+</b> Legg til kunde
            </button>
            <div className='small-margin-over'>
              <button className='editButton' type='submit'>
                Rediger ansatt
              </button>
              <button className='editButton' type='reset'>
                Reset
              </button>
            </div>
          </form>
        )}
      </div>
    );
  }
};

export default ViewRights;
