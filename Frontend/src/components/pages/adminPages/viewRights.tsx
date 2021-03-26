import React, { useState } from 'react';
import { getAllEmployees } from '../../../azure/api';

function ViewRights() {
  const mockData = {
    employe: [
      {
        admin: 'write',
        customers: [
          {
            id: '604a81cff480cf1b749f2ff9',
            permission: 'write',
          },
          {
            id: '604f5b4d494503144cb4fdb9',
            permission: 'write',
          },
          {
            id: '604a7d3b0f085c17609e9187',
            permission: 'write',
          },
          {
            id: '604a7dc84ce34420cc732811',
            permission: 'write',
          },
        ],
        employeeId: 'oyvind.husveg@kundeboss.onmicrosoft.com',
        name: 'Øyvind Timian D Husveg',
      },
      {
        admin: null,
        customers: [
          {
            id: '604a81cff480cf1b749f2ff9',
            permission: 'write',
          },
          {
            id: '604f5b4d494503144cb4fdb9',
            permission: 'write',
          },
          {
            id: '604a7d3b0f085c17609e9187',
            permission: 'write',
          },
        ],
        employeeId: 'odsnakjdask@kundeboss.onmicrosoft.com',
        name: 'Øveg',
      },
    ],
  };

  const [employeeData, setEmployeeData] = useState(mockData);

  //gets the data from the server
  async function getEmployeeData() {
    // const data = await getAllEmployees();
    // setEmployeeData(data);
  }

  //getEmployeeData();
  return (
    <div>
      <h1>ViewRights</h1>
      {/* {console.log('test')}
      {console.log(employeeData)} */}

      {employeeData.employe.map((employ) => {
        return <DisplayEmployeeRights name={employ.name} isAdmin={employ.admin} customers={employ.customers} />;
      })}
    </div>
  );
}

interface employeeRights {
  name: string;
  isAdmin?: string;
  customers?: any;
}

interface employeeRightsCustomers {
  name: string;
  rights: string;
}

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

export default ViewRights;
