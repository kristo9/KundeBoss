import GetCustomerCategories from '../GetCustomerCategories/index';
import { prepareContext, httpRequest, timeout } from './sharedItems';

describe('GetCustomerCategories', () => {
  test('Userid without admin permissions', async (done) => {
    let context = prepareContext();
    let request = httpRequest;
    request.headers.authorization = 'bjerk.diden.didrik@gmail.com';

    GetCustomerCategories(context as any, httpRequest as any);
    await timeout(context);
   
    expect(context.res.status).toEqual(401);
    done();
  });

  test('EMployee not reg in db', async (done) => {
    let context = prepareContext();
    let request = httpRequest;
    request.headers.authorization = 'madeup@Mail.com';

    GetCustomerCategories(context as any, httpRequest as any);
    await timeout(context);

    expect(context.res.status).toEqual(401);
    done();
  });

  test('EMployee not reg in db', async (done) => {
    let context = prepareContext();
    let request = httpRequest;
    request.headers.authorization = 'test';

    GetCustomerCategories(context as any, httpRequest as any);
    await timeout(context);

    expect(context.res.status).toEqual(401);
    done();
  });
});
