import GetCustomersAndSuppliers from '../GetCustomersAndSuppliers';
import { prepareContext, httpRequest, timeout } from './sharedItems';

describe('User credentials', () => {
  test('Should work as expected', async (done) => {
    let context = prepareContext();
    let request = httpRequest;
    request.headers.authorization = 'oyvind.husveg@kundeboss.onmicrosoft.com';

    GetCustomersAndSuppliers(context as any, request as any);
    await timeout(context);

    expect(context.done).toEqual(true);
    expect(context.res.status).toEqual(200);
    expect(context.res.body.length).toBeGreaterThanOrEqual(1);
    done();
  });

  it('Userid doesnt have sufficient permission', async (done) => {
    let context = prepareContext();
    let request = httpRequest;
    request.headers.authorization = 'timTest@flyt.cloud';

    GetCustomersAndSuppliers(context as any, request as any);
    await timeout(context);

    expect(context.done).toEqual(true);
    expect(context.res.body).toBe('User dont have admin-write/read permission');
    expect(context.res.status).toBe(401);
    done();
  });

  it('Userid not in database', async (done) => {
    let context = prepareContext();
    let request = httpRequest;
    request.headers.authorization = 'timtt@gmail.org';

    GetCustomersAndSuppliers(context as any, request as any);
    await timeout(context);

    expect(context.done).toEqual(true);
    expect(context.res.body).toBe('User dont have admin-write/read permission'); //Because he is not in the database
    expect(context.res.status).toBe(401);
    done();
  });

  it('Token is empty/null', async (done) => {
    let context = prepareContext();
    let request = httpRequest;
    request.headers.authorization = '';

    GetCustomersAndSuppliers(context as any, request as any);
    await timeout(context);

    expect(context.done).toEqual(true);
    expect(context.res.body).toBe('Token is null');
    expect(context.res.status).toBe(401);
    done();
  });

  test('Token invalid', async (done) => {
    let context = prepareContext();
    let request = httpRequest;
    request.headers.authorization = 'test';

    GetCustomersAndSuppliers(context as any, request as any);
    await timeout(context);

    expect(context.done).toEqual(true);
    expect(context.res.body).toBe('Token not valid');
    expect(context.res.status).toBe(401);
    done();
  });
});
