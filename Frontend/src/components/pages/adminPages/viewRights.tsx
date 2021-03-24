import React, { useState } from 'react';
import { getAllEmployees } from '../../../azure/api';

function ViewRights() {
  const [employeeData, setEmployeeData] = useState(null);

  //gets the data from the server
  async function getEmployeeData() {
    const data = await getAllEmployees();
    setEmployeeData(data);
  }

  //getEmployeeData();
  return (
    <div>
      <h1>ViewRights</h1>
      {console.log('test')}
      {console.log(employeeData)}
    </div>
  );
}

function DisplayEmployee() {
  return (
    <div>
      <p>Test</p>
    </div>
  );
}

export default ViewRights;
