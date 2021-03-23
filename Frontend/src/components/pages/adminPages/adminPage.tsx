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
  const [adminData, setAdminData] = useState(null);
  const [CurrentPage, setCurrentPage] = useState(<ViewRights />);

  const buttons: SBElementProps = [
    { text: 'Se rettigheter', ID: 'rights', onClick: () => setCurrentPage(<ViewRights />) },
    { text: 'Ny kunde', ID: 'newCustomer', onClick: () => setCurrentPage(<NewCustomer />) },
    { text: 'Ny leverandør', ID: 'newSupplier', onClick: () => setCurrentPage(<NewSupplier />) },
    { text: 'Nyinnlogget', ID: 'newLogin', onClick: () => setCurrentPage(<NewSupplier />) }, //TODO: lage side for nyinnlogget
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
