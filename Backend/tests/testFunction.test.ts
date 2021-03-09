import testFunction from '../testFunction/index';
import { Context } from '@azure/functions';

describe('Test for demo function', () => {
  let context: Context;
  beforeEach(() => {
    context = ({ log: jest.fn() } as unknown) as Context;
  });

  it('Should return 200', async () => {
    const request = {
      method: null, // HTTP request method used to invoke this function.
      url: 'vg.no', // Request URL
      headers: null, // HTTP request headers.
      query: {}, // Query string parameter keys and values from the URL.
      params: null, // Route parameter keys and values.
      body: { name: 'Tom' }, // The HTTP request body.
    };

    await testFunction(context, request);

    console.log(context.res);

    //expect(context.log).toBeCalledTimes(1); //Må ha connectRead for denne? Man da er context.res undefined
    expect(context.res.status).toEqual(200);
    expect(context.res.body).toEqual('Sea shanty');
  });
});
