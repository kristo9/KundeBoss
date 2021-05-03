import testFunction from '../testFunction/index';

import { prepareContext, timeout } from './sharedItems';


test('testFunction should return 200',async (done) => {
  let context = prepareContext();

  testFunction(context);
  await timeout(context);
  console.log("test")
  expect(context.res.status).toEqual(200);
  expect(context.res.body).toEqual('Sea shanty');
  done();
});
