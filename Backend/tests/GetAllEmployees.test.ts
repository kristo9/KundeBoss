import { invalidToken, token } from './sharedItems';

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

//jest.mock('../SharedFiles/dataBase');

describe('GetAllEmployees function', () => {
  test('status should return 200, no problems', async () => {
    let context = {
      res: { status: null, body: null },
      log: jest.fn(),
      done: null,
    };

    context.done = () => {
      context.done = true;
    };

    GetAllEmployees(context, request);
    await timeout(context);

    //expect(context.res.body)
    expect(context.res.status).toEqual(200);
    expect(context.done).toEqual(true);
  });

  test('status should return 401. Invalid token', async () => {
    let context = {
      res: { status: null, body: null },
      log: jest.fn(),
      done: null,
    };
    context.done = () => {
      context.done = true;
    };
    request.headers = { 'authorization': 'Bearer ' + invalidToken };

    GetAllEmployees(context, request);
    await timeout(context);

    expect(context.res.status).toEqual(401);
    expect(context.res.body).toEqual('Token not valid');
    expect(context.done).toEqual(true);
  });

  test('status should return 401. Token is null', async () => {
    let context = {
      res: { status: null, body: null },
      log: jest.fn(),
      done: null,
    };
    context.done = () => {
      context.done = true;
    };
    request.headers = { 'authorization': null };

    GetAllEmployees(context, request);
    await timeout(context);

    expect(context.res.status).toEqual(401);
    expect(context.res.body).toEqual('Token is null');
    expect(context.done).toEqual(true);
  });

  test('status should return 401. User dont have admin-write permission', async () => {
    let context = {
      res: { status: null, body: null },
      log: jest.fn(),
      done: null,
    };
    context.done = () => {
      context.done = true;
    };
    request.headers = { 'authorization': 'Bearer ' + token };

    GetAllEmployees(context, request);
    await timeout(context);

    expect(context.res.status).toEqual(401);
    expect(context.res.body).toEqual('User dont have admin-write permission');
    expect(context.done).toEqual(true);
  });
});

async function timeout(context) {
  let i = 0;
  for (; i < 100 && context.done !== true; ++i) {
    await new Promise((r) => setTimeout(r, 100));
  }
  //console.log('Time: ' + --i * 100 + 'ms');
}
