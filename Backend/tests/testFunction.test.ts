import testFunction from '../testFunction/index';

test('testFunction should return 200', () => {
  let context = { log: jest.fn(), done: jest.fn(), res: { status: null, body: null } };
  testFunction(context);

  expect(context.res.status).toEqual(200);
  expect(context.res.body).toEqual('Sea shanty');
  expect(context.done).toHaveBeenCalledTimes(1);
});
