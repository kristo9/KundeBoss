// MOCKS
import {
  callLogin,
  getCustomer,
  getEmployee,
  modifyEmployeeData,
  setUsername,
  isLogedIn,
  logToken,
} from '../src/azure/api';
import { SignIn, SignOut, getTokenRedirect } from '../src/azure/authRedirect';

jest.mock('../src/azure/authRedirect');
jest.mock('../src/azure/api');

import React from 'react';
import { render } from '@testing-library/react';

import Dashboard from '../src/components/pages/dashboard/Dashboard';

//const spyGetEmployee = jest.spyOn(require('../src/components/pages/dashboard/Dashboard'), 'getEmployee');
// spyGetEmployee.mockImplementation(() => {
//   console.log('get employee testdvhasdbhah');
//   return Promise.resolve(mockData);
// });

//const spyAutRedirect = jest.spyOn(require('../src/azure/authRedirect'), 'getTokenRedirect');
// spyAutRedirect.mockImplementation(() => {
//   console.log('PublicClientApplication test');
//   return 'eee';
// });

test('test', () => {
  const { debug } = render(<Dashboard />);

  debug();
});

const mockData = {
  _id: '603648ae0ab39703a4580395',
  name: 'Didrik K Bjerk',
  employeeId: 'didrik.bjerk@kundeboss.onmicrosoft.com',
  customerNames: [
    {
      _id: '6038a9dd01c4ba40c8203cc5',
      name: 'Bedrift AS',
      contact: {
        mail: 'Bedrift@mail.no',
        name: 'Ola Normann',
      },
      tags: [],
    },
    {
      _id: '6038aa2401c4ba40c8203cc6',
      name: 'Business Inc',
      contact: {
        mail: 'business@mail.no',
        name: 'Hans Bjørn',
      },
      tags: [],
    },
    {
      _id: '6038af09119edd5c0b80cadd',
      name: 'Pengebingen',
      contact: {
        mail: 'Skrue.Onkel@Daudbilbakken.no',
        name: 'Onkel Skrue',
      },
      tags: ['Vikgtig Kunde', 'Kresen'],
    },
  ],
};
