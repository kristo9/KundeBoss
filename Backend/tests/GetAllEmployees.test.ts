import { token } from './sharedItems';

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
  let context = {
    res: { status: null, body: null },
    log: jest.fn(),
    done: null,
  };

  context.done = () => {
    context.done = true;
  };
  test('status should return 200', async () => {
    GetAllEmployees(context, request);

    let i = 0;
    for (; i < 100 && context.done !== true; ++i) {
      await new Promise((r) => setTimeout(r, 100));
    }
    console.log('Time: ' + --i * 100 + 'ms');

    expect(context.res.status).toEqual(200);
    expect(context.done).toEqual(true);
  });
});
