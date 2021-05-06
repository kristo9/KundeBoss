import React, { useEffect, useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { InputField, Select } from '../../../basicComp/inputField';

interface EmployeeRights {
  name: string;
  employeeId: string;
  admin: string;
  customersInfo: { customerInfo: EmployPermissionForACustomer }[];
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

  return (
    <div>
      <h1>ViewRights</h1>

      {/* Searchfield */}
      <input type='text' placeholder='Søk' value={searchTerm} onChange={handleChange}></input>

      {/* Displayes all the employees and there rights */}
      <ul>
        {searchResults.map((employee, index) => (
          <li key={employee.employeeId}>
            <DisplayAndEditEmployeeRights
              employeeId={employee.employeeId}
              name={employee.name}
              admin={employee.admin}
              customersInfo={employee.customersInfo}
              index={index}
            />
          </li>
        ))}
      </ul>
    </div>
  );
};

function DisplayAndEditEmployeeRights(props: EmployeeRights & { index: number }) {
  const [isOpen, setIsOpen] = useState(false);

  const { register: register, handleSubmit: handleSubmit, control: control } = useForm<EmployeeRights>({
    defaultValues: {
      employeeId: props.employeeId,
      name: props.name,
      admin: props.admin,
      customersInfo: props.customersInfo,
    },
  });
  const { fields: permissionField, append: permissionFieldAppend, remove: permissionFieldRemove } = useFieldArray({
    control,
    name: 'customersInfo',
  });

  return (
    <div>
      <h2>{props.name}</h2>

      <button onClick={() => setIsOpen(!isOpen)}>s</button>

      {!isOpen ? (
        <p>{props?.customersInfo?.length}</p>
      ) : (
        <form
          onSubmit={handleSubmit((data) => {
            console.log(data);
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
          {/* Kan mailen endres ? */}
          {/* <InputField
          labelText={'Navn'}
          lableType={'text'}
          lableName={'name' + props.index}
          placeholderText={'Ansattes mail'}
          defaultValue={props.name}
          register={register('employeeId')}
        /> */}
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

          {permissionField.map(({ id }, index, customer) => {
            return (
              <div key={id}>
                <button onClick={() => permissionFieldRemove(index)}>x</button>
                <Select
                  register={register(`customersInfo.${index}.customerInfo._id` as const)}
                  name={`customersInfo.${index}.customerInfo._id`}
                  defaultOption={{ name: 'Velg kunde', value: 'default' }}
                  defaultValue={customer[index].id}
                  // options={supplierArrayState?.map(({ name, _id }) => {
                  //   return { name: name, value: _id };
                  // })}
                  options={[
                    { name: 'test1', value: 'test1' },
                    { name: 'test2', value: 'test2' },
                    { name: 'test3', value: 'test3' },
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

// function DisplayCustomerRightsOfEmployee(props: EmployPermissionForACustomer) {
//   return (
//     <div style={{ backgroundColor: 'red' }}>
//       <p>
//         {props.name} {props.rights}
//       </p>
//     </div>
//   );
// }

export default ViewRights;

/*
function VewRights({ adminData } : any) {
  
  console.log(adminData)

  const [search, UpdateSearch] = useState('');
  const [employeeData, setEmployeeData] = useState(adminData);
  
  let filteredEmployees = null;

  if(adminData.length > 0){
    filteredEmployees = adminData.filter(
      (employee) => { 
        const name = employee.name.toString().toLowerCase();
        return name.indexOf(search.toLowerCase()) !== -1}
    );
  }

  console.log(filteredEmployees)
  return (
    <div>
      <h1>ViewRights</h1>
      <input type="text"
              placeholder="Search Employee"
              value={search}
              onChange={UpdateSearch.bind(this)}> 
      </input>
      <div>{DisplayEmployeeRights(filteredEmployees)}</div>
    </div>
  );
}

*/

/*
function DisplayEmployeeRights(props: employeeRights) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      onClick={() => {
        if (!props.isAdmin) {
          setIsOpen(!isOpen);
        }
      }}
    >
      <p>
        <b>{props.name}</b> {props.isAdmin ? <span>Admin: {props.isAdmin} </span> : ''}
        <p>{props.isAdmin ? '' : <span> Har rettigheter til {props.customers.length} kunder </span>}</p>
      </p>
      {isOpen ? (
        props.customers.map((customer) => {
          return <DisplayCustomerRightsOfEmployee name={customer.id} rights={customer.permission} />;
        })
      ) : (
        <p></p>
      )}
    </div>
  );
}

function DisplayCustomerRightsOfEmployee(props: employeeRightsCustomers) {
  return (
    <div style={{ backgroundColor: 'red' }}>
      <p>
        {props.name} {props.rights}
      </p>
    </div>
  );
}


*/
