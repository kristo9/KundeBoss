import React from 'react';
import Searchfield from '../../basicComp/searchfield';
import LoadingSymbol from '../../basicComp/loading';

const mockData = {
  users: [
    {
      _id: '603648ae0ab39703a4580395',
      name: 'Didrik K Bjerk',
      employeeId: 'didrik.bjerk@kundeboss.onmicrosoft.com',
      t: 'noe',
    },
    {
      _id: '603648420ab39703a4580395',
      name: 'Alexander',
      employeeId: 'alexander.bjerk@kundeboss.onmicrosoft.com',
    },
  ],
};

function AdminPage() {
  return (
    <div>
      <h1>Admin side</h1>
      <Searchfield />
      {mockData.users.map((user) => (
        <DisplayInfo name={user.name} />
      ))}
      <LoadingSymbol />
    </div>
  );
}

interface userInfo {
  name: string;
  type?: string;
}

function DisplayInfo(props: userInfo) {
  return (
    <div>
      <p>
        <b>{props.name} </b>

        {props.type === 'customer' ? 'Kunde' : 'Ansatt'}
      </p>

      <b></b>
    </div>
  );
}

export default AdminPage;
