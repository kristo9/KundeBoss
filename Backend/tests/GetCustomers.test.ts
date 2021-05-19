import { prepareContext, httpRequest as httpRequest, timeout, userAdmin, userNotAdmin } from './sharedItems';
import GetCustomers from '../GetCustomers/index';

describe('GetCustomers function', () => {
  test('status should return 200, one or more customers', async (done) => {
    let context = prepareContext();
    let request = httpRequest;
    request.headers.authorization = userAdmin;

    GetCustomers(context as any, request as any);
    await timeout(context);

    expect(context.res.status).toEqual(200);
    expect(Object.keys(context.res.body.customerInformation).length).toBeGreaterThanOrEqual(1);
    expect(context.done).toEqual(true);
    expect(context.res.body.customerInformation.length).toBeGreaterThan(1);
    done();
  });
});

describe('GetCustomers function', () => {
  test('made up mail', async (done) => {
    let context = prepareContext();
    let request = httpRequest;
    request.headers.authorization = 'madeup@mail';
    GetCustomers(context as any, request as any);
    await timeout(context);

    expect(context.res.status).toEqual(401);
    done();
  });
});

describe('GetCustomers function', () => {
  test('status should return 200, 0 cust', async (done) => {
    let context = prepareContext();
    let request = httpRequest;
    request.headers.authorization = userNotAdmin;

    GetCustomers(context as any, request as any);
    await timeout(context);

    expect(context.res.status).toEqual(200);
    expect(context.done).toEqual(true);
    expect(context.res.body.customerInformation.length).toEqual(0);
    done();
  });
});
