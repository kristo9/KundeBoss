import React, { useEffect, useState, useContext } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { getAllCustomer, getEmployee, modifyEmployeeData } from '../../../../azure/api';
import { InputField, Select } from '../../../basicComp/inputField';
import { LanguageContext } from '../../../../Context/language/LangContext';

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

/**
 * @desc Displays/modyfy the employees data and permissions.
 * @param adminData Data about the employees
 * @returns React component
 */
const ViewRights = ({ adminData }: any) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<EmployeeRights[]>([]);
  const [customerData, setCustomerData] = useState(null);

  const { dictionary } = useContext(LanguageContext);

  // Searchfield logic
  const handleChange = (event) => {
    setSearchTerm(event.target.value);
  };
  // Updates page based if search result changes
  useEffect(() => {
    const results = adminData.filter((employee) => employee.name.toLowerCase().includes(searchTerm.toLowerCase()));
    setSearchResults(results);
  }, [searchTerm]);

  // Gets all customers, is used when updating the rights of an employee
  useEffect(() => {
    const fetchAllCustomers = async () => {
      let customers = await getAllCustomer();
      setCustomerData(customers);
    };

    fetchAllCustomers();
  }, []);

  return (
    <div>
      <h1 className='color-dark heading'>{dictionary.admin.permissions}</h1>
      <div style={{ marginBottom: '4em' }}>
        {/* Searchfield */}
        <input
          style={{ float: 'right', marginBottom: '2em' }}
          className='search'
          type='text'
          placeholder={dictionary.search_Name}
          value={searchTerm}
          onChange={handleChange}
        ></input>
      </div>
      {/* Displayes all the employees and their rights */}
      <section className='employeeDisplay'>
        <ul>
          {searchResults.map((employee, index) =>
            !(employee.isCustomer || employee === null) ? (
              <li key={employee.employeeId} className='displayInfoDiv'>
                {/* Display a single employee */}
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

  /**
   *
   * @param name name of the employee
   * @param employeeId id of the employee
   * @param admin is the user an admin
   * @param isCustomer: is the user a cutomer
   * @param customerInformation[] information obout the employee's cutomers
   * @param customerInformation[]._id id of the customers
   * @param customerInformation[].name name of the customers
   * @param customerInformation[].permission the permission of the employee on that customer
   * @param index its index in the displayed list
   * @returns A react component that displayes the rights of an employee
   */
  function EmployeRights(props: EmployeeRights & { index: number }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <div>
        <div style={{ display: 'flex' }}>
          {/* Button to open more details about an employee */}
          <button
            className='rotate90'
            style={{ height: '2em', marginRight: '0.5em' }}
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? '>' : '<'}
          </button>
          <h3>{props.name}</h3>
        </div>

        {/* if closed, display a small amout of information about the employee */}
        {!isOpen ? (
          <div>
            <p style={{ fontSize: '0.8em', margin: '0.1em' }}>{props.employeeId}</p>
            <p style={{ marginBottom: 0 }}>
              {props.admin === 'write'
                ? 'Admin ' + dictionary.write
                : props.admin === 'read'
                ? 'Admin ' + dictionary.read
                : dictionary.admin.has + ' ' + props.customerInformation.length + ' ' + dictionary.admin.customers}
            </p>
          </div>
        ) : (
          //if open dispaly all information about an employee
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

  /**
   *
   * @param name name of the employee
   * @param employeeId id of the employee
   * @param admin is the user an admin
   * @param isCustomer: is the user a cutomer
   * @param customerInformation[] information obout the employee's cutomers
   * @param customerInformation[]._id id of the customers
   * @param customerInformation[].name name of the customers
   * @param customerInformation[].permission the permission of the employee on that customer
   * @param index its index in the displayed list
   * @returns A react component that displayes the rights of an employee
   */
  function DisplayAndEditEmployeeRights(props: EmployeeRights & { index: number }) {
    const [isEditOpen, setEditIsOpen] = useState(false);

    // creates form, and sets the default values
    const { register: register, handleSubmit: handleSubmit, control: control } = useForm<EmployeeRights>({
      defaultValues: {
        employeeId: props?.employeeId,
        name: props?.name,
        admin: props?.admin,
        customerInformation: props?.customerInformation,
      },
    });

    // creates the dynamic from, used to set customer permissions
    const { fields: permissionField, append: permissionFieldAppend, remove: permissionFieldRemove } = useFieldArray({
      control,
      name: 'customerInformation',
    });

    return (
      <div>
        {/* Edit button */}
        <button className='editButton' onClick={() => setEditIsOpen(!isEditOpen)}>
          {isEditOpen ? dictionary.cancel : dictionary.edit}
        </button>

        {/* Display information */}
        {!isEditOpen ? (
          <div>
            <p>{props.employeeId}</p>
            <ul>
              {/* loop through all customers an amployee has */}
              {props.customerInformation.map((customer) => {
                return (
                  <li key={customer._id}>
                    <b>{customer.name}</b>

                    <span> {customer.permission === 'write' ? dictionary.write : dictionary.read}</span>
                  </li>
                );
              })}
            </ul>
          </div>
        ) : (
          // display a edit page
          <form
            onSubmit={handleSubmit((data) => {
              let adminPermission: string = data.admin === 'Ingen' ? 'null' : data.admin;

              //sends the info about the eployee to the backend
              modifyEmployeeData(
                data.employeeId,
                data.name,
                adminPermission,
                data.isCustomer,
                data.customerInformation.map((customerI) => {
                  return { id: customerI._id, permission: customerI.permission };
                })
              );
            })}
          >
            <InputField
              labelText={dictionary.name}
              lableType={'text'}
              lableName={'name' + props.index}
              placeholderText={dictionary.admin.employeeName}
              defaultValue={props.name}
              register={register('name')}
            />
            <div className='displayInfoDiv'>
              <span>{dictionary.admin.adminPermissions}</span>
              <Select
                register={register('admin')}
                name={`admin`}
                defaultOption={{ name: dictionary.admin.none, value: null }}
                defaultValue={props.admin === null ? 'null' : props.admin}
                options={[
                  { name: dictionary.read, value: 'read' },
                  { name: dictionary.write, value: 'write' },
                ]}
              />
            </div>

            {/* displayy all the customers the employee have permssion to */}
            {permissionField.map(({ id }, index, customerInfo) => {
              return (
                <div key={id}>
                  {/* reomve customer button */}
                  <button className='removeButton' onClick={() => permissionFieldRemove(index)}>
                    x
                  </button>
                  <Select
                    register={register(`customerInformation.${index}._id` as const)}
                    name={`customersInfo.${index}.customerInfo._id`}
                    defaultOption={{ name: dictionary.admin.chooseCustomer, value: null }}
                    defaultValue={customerInfo[index]?._id}
                    options={customerData?.map(({ name, _id }) => {
                      return { name: name, value: _id };
                    })}
                  />
                  <Select
                    register={register(`customerInformation.${index}.permission` as const)}
                    name={`customersInfo.${index}.customerInfo.permission`}
                    defaultOption={{ name: dictionary.read, value: 'read' }}
                    defaultValue={customerInfo[index].permission}
                    options={[{ name: dictionary.write, value: 'write' }]}
                  />
                </div>
              );
            })}
            {/* add customer button */}
            <button className='addButton' type='button' onClick={() => permissionFieldAppend({})}>
              <b>+</b> {dictionary.admin.addCustomer}
            </button>

            {/* edit and reset buttons */}
            <div className='small-margin-over'>
              <button className='editButton' type='submit'>
                {dictionary.edit}
              </button>
              <button className='editButton' type='reset'>
                {dictionary.reset}
              </button>
            </div>
          </form>
        )}
      </div>
    );
  }
};

export default ViewRights;
