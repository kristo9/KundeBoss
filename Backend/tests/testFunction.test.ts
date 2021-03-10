import testFunction from '../testFunction/index';

let request = {
  method: null, // HTTP request method used to invoke this function.
  url: 'vg.no', // Request URL
  headers: {}, // HTTP request headers.
  query: {}, // Query string parameter keys and values from the URL.
  params: null, // Route parameter keys and values.
  body: { name: 'Tom' }, // The HTTP request body.
};

test('testFunction should return 200', () => {
  let context = { log: jest.fn(), done: jest.fn(), res: { status: null, body: null } };
  testFunction(context, request);

  expect(context.res.status).toEqual(200);
  expect(context.res.body).toEqual('Sea shanty');
  expect(context.done).toHaveBeenCalledTimes(1);
});
