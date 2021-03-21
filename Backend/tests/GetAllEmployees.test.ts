//jest.mock('../SharedFiles/dataBase');
import { invalidToken, prepareContext, token, timeout, readerToken, expectStuff } from './sharedItems';

const config = require('.././local.settings.json');
let GetAllEmployees = null;

beforeEach(async () => {
  process.env = Object.assign(process.env, {
    ...config.Values,
  });
  GetAllEmployees = require('../GetAllEmployees');
});

let request = {
  method: 'POST', // HTTP request method used to invoke this function.
  url: null, // Request URL
  headers: { 'authorization': 'Bearer ' + token }, // HTTP request headers.
  query: {}, // Query string parameter keys and values from the URL.
  params: null, // Route parameter keys and values.
  body: null, // The HTTP request body.
};

describe('GetAllEmployees function', () => {
  test('status should return 200, no problems', async () => {
    let context = prepareContext();
    console.log(context.res);
    GetAllEmployees(context, request);
    await timeout(context);

    expectStuff(context, 200, 'Token is null');
  });

  test('status should return 401. Invalid token', async () => {
    let context = prepareContext();
    request.headers = { 'authorization': 'Bearer ' + invalidToken };

    GetAllEmployees(context, request);
    await timeout(context);

    expectStuff(context, 401, 'Token not valid');
  });

  test('status should return 401. Token is null', async () => {
    let context = prepareContext();
    request.headers = { 'authorization': null };

    GetAllEmployees(context, request);
    await timeout(context);

    expectStuff(context, 401, 'Token is null');
  });

  test('status should return 401. User dont have admin-write permission', async () => {
    let context = prepareContext();
    request.headers = { 'authorization': 'Bearer ' + readerToken };

    GetAllEmployees(context, request);
    await timeout(context);

    expectStuff(context, 401, 'User dont have admin-write permission');
  });
});
