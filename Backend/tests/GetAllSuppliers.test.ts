import GetAllSuppliers from '../GetAllSuppliers';
import { prepareContext, httpRequest, timeout } from './sharedItems';

describe('User credentials', () => {
  test('Should work as expected', async (done) => {
    let context = prepareContext();
    let request = httpRequest;
    request.headers.authorization = 'oyvind.husveg@kundeboss.onmicrosoft.com';

    GetAllSuppliers(context as any, httpRequest as any);
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

    GetAllSuppliers(context as any, httpRequest as any);
    await timeout(context);

    expect(context.done).toEqual(true);
    expect(context.res.status).toBe(401);
    done();
  });

  it('Userid not in database', async (done) => {
    let context = prepareContext();
    let request = httpRequest;
    request.headers.authorization = 'timTest333@gmail.net';

    GetAllSuppliers(context as any, httpRequest as any);
    await timeout(context);

    expect(context.done).toEqual(true);
    expect(context.res.status).toBe(401);
    done();
  });

  it('Token is empty/null', async (done) => {
    let context = prepareContext();
    let request = httpRequest;
    request.headers.authorization = '';

    GetAllSuppliers(context as any, httpRequest as any);
    await timeout(context);

    expect(context.done).toEqual(true);
    expect(context.res.status).toBe(401);
    done();
  });

  test('Token invalid', async (done) => {
    let context = prepareContext();
    let request = httpRequest;
    request.headers.authorization = 'test';

    GetAllSuppliers(context as any, httpRequest as any);
    await timeout(context);

    expect(context.done).toEqual(true);
    expect(context.res.status).toBe(401);
    done();
  });
});
