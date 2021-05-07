import React, { useEffect, useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { getAllCustomer, getEmployee, modifyEmployeeData } from '../../../../azure/api';
import { InputField, Select } from '../../../basicComp/inputField';

interface EmployeeRights {
  name: string;
  employeeId: string;
  admin: string;
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
      <h1>ViewRights</h1>

      {/* Searchfield */}
      <input type='text' placeholder='Søk' value={searchTerm} onChange={handleChange}></input>

      {/* Displayes all the employees and there rights */}
      <ul>
        {searchResults.map((employee, index) => (
          <li key={employee.employeeId}>
            <EmployeRights
              employeeId={employee.employeeId}
              name={employee.name}
              admin={employee.admin}
              customerInformation={employee.customerInformation}
              index={index}
            />
          </li>
        ))}
      </ul>
    </div>
  );

  function EmployeRights(props: EmployeeRights & { index: number }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <div>
        <h2>{props.name}</h2>
        <button onClick={() => setIsOpen(!isOpen)}>{isOpen ? 'Lukk' : 'Åpne'}</button>

        {!isOpen ? (
          <p>
            {props.admin === 'write'
              ? 'Admin skriv'
              : props.admin === 'read'
              ? 'les'
              : 'Har ' + props.customerInformation.length + ' kunder'}
          </p>
        ) : (
          <DisplayAndEditEmployeeRights
            employeeId={props.employeeId}
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
        <button onClick={() => setEditIsOpen(!isEditOpen)}>{isEditOpen ? 'Avbryt' : 'Rediger'}</button>

        {!isEditOpen ? (
          <div>
            <p>{props.employeeId}</p>
            {props.customerInformation.map((customer) => {
              return (
                <div>
                  <span>
                    <b>{customer.name}</b>
                  </span>
                  <span> {customer.permission === 'write' ? 'skriv' : 'les'}</span>
                </div>
              );
            })}
          </div>
        ) : (
          <form
            onSubmit={handleSubmit((data) => {
              console.log(data);

              modifyEmployeeData(
                data.employeeId,
                data.name,
                data.admin,
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
                defaultOption={{ name: 'Nei?', value: null }}
                defaultValue={props.admin}
                options={[
                  { name: 'Les', value: 'read' },
                  { name: 'Skriv', value: 'write' },
                ]}
              />
            </div>

            {permissionField.map(({ id }, index, customerInfo) => {
              return (
                <div key={id}>
                  <button onClick={() => permissionFieldRemove(index)}>x</button>
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
                    defaultOption={{ name: 'Velg kunde', value: null }}
                    defaultValue={customerInfo[index].permission}
                    options={[
                      { name: 'les', value: 'read' },
                      { name: 'skriv', value: 'write' },
                    ]}
                  />
                </div>
              );
            })}
            <button type='button' onClick={() => permissionFieldAppend({})}>
              Legg til kunde
            </button>
            <button type='submit'>Rediger ansatt</button>
            <button type='reset'>Reset</button>
          </form>
        )}
      </div>
    );
  }
};

export default ViewRights;
