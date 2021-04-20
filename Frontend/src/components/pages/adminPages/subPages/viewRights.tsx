import React, { useEffect, useState } from 'react';

interface employeeRights {
  name: string;
  admin?: string;
  customerInformation?: any;
}

interface employeeRightsCustomers {
  name: string;
  rights: string;
}



const ViewRights = ( {adminData} : any ) => {
  
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const handleChange = event => {
    setSearchTerm(event.target.value);
  };

  useEffect(() => {
    const results = adminData.filter(employee =>
      employee.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setSearchResults(results);
  }, [searchTerm]);

console.log(searchResults);

  return (
    <div>
      <h1>ViewRights</h1>
      <input type="text"
        placeholder="Søk"
        value={searchTerm}
        onChange={handleChange}>
      </input>
      <div>
        {searchResults.map( 
          employee => 
              <li key={employee.employeeId}> {DisplayEmployeeRights(employee)} </li>
              )
            }
      </div>
    </div>
  );
}

function DisplayEmployeeRights(props: employeeRights) {
  
  //const [isOpen, setIsOpen] = useState(false);
  //setIsOpen(!isOpen);
  //isOpen

  console.log(props.admin);
  return (
    <div
      onClick={() => {
        if (!props.admin) {
          
        }
      }}
    >
      <p>
        <b>{props.name}</b> 
        { (props.admin === "write") ? <span> Admin: {props.admin} </span> : ''}
        { (props.admin === "reader") ? <span> Admin: {props.admin} </span> : ''}
        {  props.admin ? '' : <span> Har rettigheter til {props.customerInformation.length} kunder </span>}
      </p>
      {true ? (
        props.customerInformation.map((customer) => {
          return <DisplayCustomerRightsOfEmployee key={customer._id} name={customer.name} rights={customer.permission} />;
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