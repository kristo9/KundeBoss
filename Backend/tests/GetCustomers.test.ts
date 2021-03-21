import { invalidToken, token, timeout, expectStuff, prepareContext } from './sharedItems';

const config = require('.././local.settings.json');
let GetCustomers = null;

beforeEach(async () => {
  process.env = Object.assign(process.env, {
    ...config.Values,
  });
  GetCustomers = require('../GetCustomers');
});

let request = {
  method: 'POST', // HTTP request method used to invoke this function.
  url: null, // Request URL
  headers: { 'authorization': 'Bearer ' + token }, // HTTP request headers.
  query: {}, // Query string parameter keys and values from the URL.
  params: null, // Route parameter keys and values.
  body: null, // The HTTP request body.
};

describe('GetCustomers function', () => {
  test('status should return 200, one or more customers', async () => {
    let context = prepareContext();

    GetCustomers(context, request);
    await timeout(context);

    expect(context.res.status).toEqual(200);
    expect(Object.keys(context.res.body.customerInformation).length).toBeGreaterThanOrEqual(1);
    expect(context.done).toEqual(true);
  });

  test('status should return 401. Token is null', async () => {
    let context = prepareContext();
    request.headers = { 'authorization': null };

    GetCustomers(context, request);
    await timeout(context);

    expectStuff(context, 401, 'Token is null');
  });

  test('status should return 401. Invalid token', async () => {
    let context = prepareContext();
    request.headers = { 'authorization': 'Bearer ' + invalidToken };

    GetCustomers(context, request);
    await timeout(context);

    expectStuff(context, 401, 'Token not valid');
  });
});
