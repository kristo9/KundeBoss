import GetAllSuppliers from '../GetAllSuppliers';
import { prepareContext, httpRequest, timeout } from './sharedItems';

describe('User credentials', () => {
  test('Should work as expected', async (done) => {
    let context = prepareContext();
    let request = httpRequest;
    request.headers.authorization = 'oyvind.husveg@kundeboss.onmicrosoft.com';

    GetAllSuppliers(context as any, request as any);
    await timeout(context);

    expect(context.done).toEqual(true);
    expect(context.res.status).toEqual(200);
    expect(context.res.body.length).toBeGreaterThanOrEqual(1);
    done();
  });

  test('Userid not in database', async (done) => {
    let context = prepareContext();
    let request = httpRequest;
    request.headers.authorization = 'timTest333@gmail.net';

    GetAllSuppliers(context as any, request as any);
    await timeout(context);

    expect(context.done).toEqual(true);
    expect(context.res.body).toBe('User invalid');
    expect(context.res.status).toBe(401);
    done();
  });

  test('Token is empty/null', async (done) => {
    let context = prepareContext();
    let request = httpRequest;
    request.headers.authorization = '';

    GetAllSuppliers(context as any, request as any);
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

    GetAllSuppliers(context as any, request as any);
    await timeout(context);

    expect(context.done).toEqual(true);
    expect(context.res.body).toBe('Token not valid');
    expect(context.res.status).toBe(401);
    done();
  });
});
