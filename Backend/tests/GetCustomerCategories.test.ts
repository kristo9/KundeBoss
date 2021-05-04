import GetCustomerCategories from '../GetCustomerCategories/index';
import { prepareContext, httpRequest, timeout } from './sharedItems';

describe('Should work as expected', () => {
  test('GetCustomerCategories', async (done) => {
    let context = prepareContext();
    let request = httpRequest;
    request.headers.authorization = 'didrik.bjerk@kundeboss.onmicrosoft.com';

    GetCustomerCategories(context as any, httpRequest as any);
    await timeout(context);

    expect(context.res.status).toEqual(200);
    done()
  });
});

describe('Userid without admin permissions', () => {
  test('GetCustomerCategories', async (done) => {
    let context = prepareContext();
    let request = httpRequest;
    request.headers.authorization = 'bjerk.diden.didrik@gmail.com';

    GetCustomerCategories(context as any, httpRequest as any);
    await timeout(context);
    
    expect(context.res.status).toEqual(401);
    done()
  });
});

describe('Userid not registered in database', () => {
  test('GetCustomerCategories', async (done) => {
    let context = prepareContext();
    let request = httpRequest;
    request.headers.authorization = 'madeup@Mail.com';

    GetCustomerCategories(context as any, httpRequest as any);
    await timeout(context);
   
    expect(context.res.status).toEqual(401);
    done()
  });
});
