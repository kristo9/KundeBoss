import React, { useState } from 'react';

function ViewRights(props: any) {
  const [employeeData, setEmployeeData] = useState(null);

  return (
    <div>
      <h1>ViewRights</h1>
      <p>NOENOENEOEN</p>
      <DisplayEmployee />
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
