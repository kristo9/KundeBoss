import React, { useState } from 'react';
import Searchfield from '../../basicComp/searchfield';
import LoadingSymbol from '../../basicComp/loading';
import { SBElementProps, SBProps, Sidebar } from '../../basicComp/sidebar';
import NewCustomer from './newCustomer';
import ViewRights from './viewRights';
import NewSupplier from './newSupplier';

const mockData = {
  users: [
    {
      _id: '603648ae0ab39703a4580395',
      name: 'Didrik K Bjerk',
      employeeId: 'didrik.bjerk@kundeboss.onmicrosoft.com',
    },
    {
      _id: '603648420ab39703a4580395',
      name: 'Alexander',
      employeeId: 'alexander.bjerk@kundeboss.onmicrosoft.com',
    },
  ],
};

function AdminPage() {
  const [CurrentPage, setCurrentPage] = useState(<ViewRights />);
  const buttons: SBElementProps = [
    { text: 'Se rettigheter', ID: '1', onClick: () => setCurrentPage(<ViewRights />) },
    { text: 'Lag kunde', ID: '2', onClick: () => setCurrentPage(<NewCustomer />) },
    { text: 'Lag leverandør', ID: '3', onClick: () => setCurrentPage(<NewSupplier />) },
    { text: 'Nyinnlogget', ID: '4', onClick: () => setCurrentPage(<NewSupplier />) }, //TODO: lage side for nyinnlogget
  ];

  return (
    <div className='H100'>
      <Sidebar text='Admin page' buttons={buttons} />
      <div>
        {CurrentPage ? CurrentPage : <LoadingSymbol />}
        {/* {mockData.users.map((user) => (
          <DisplayInfo name={user.name} />
        ))}
        <LoadingSymbol /> */}
      </div>
    </div>
  );
}

function a(props: string) {
  console.log(props);
}

interface userInfo {
  name: string;
  type?: string;
}

function DisplayInfo(props: userInfo) {
  return (
    <p>
      <b>{props.name} </b>

      {props.type === 'customer' ? 'Kunde' : 'Ansatt'}
    </p>
  );
}

export default AdminPage;
