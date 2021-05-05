import GetSupplierData from '../GetSupplierData';
import { prepareContext, httpRequest, timeout } from './sharedItems';

let token = 'oyvind.husveg@kundeboss.onmicrosoft.com';
describe('User credentials', () => {
  test('Should work as expected', async (done) => {
    let context = prepareContext();
    let request = httpRequest;
    request.headers.authorization = 'oyvind.husveg@kundeboss.onmicrosoft.com';
    request.body['id'] = '605b37ae6c35ab18d8c49da7';

    GetSupplierData(context as any, request as any);
    await timeout(context);

    expect(context.done).toEqual(true);
    expect(context.res.body).toHaveProperty('_id', '605b37ae6c35ab18d8c49da7');
    expect(context.res.status).toBe(200);
    done();
  });

  test('Token is empty/null', async (done) => {
    let context = prepareContext();
    let request = httpRequest;
    request.headers.authorization = '';
    request.body['id'] = '605b37ae6c35ab18d8c49da7';

    GetSupplierData(context as any, request as any);
    await timeout(context);

    expect(context.done).toEqual(true);
    expect(context.res.body).toBe('no token');
    expect(context.res.status).toBe(400);
    done();
  });

  test('Token invalid', async (done) => {
    let context = prepareContext();
    let request = httpRequest;
    request.headers.authorization = 'test';
    request.body['id'] = '605b37ae6c35ab18d8c49da7';

    GetSupplierData(context as any, request as any);
    await timeout(context);

    expect(context.done).toEqual(true);
    expect(context.res.body).toBe('Token not valid');
    expect(context.res.status).toBe(401);
    done();
  });

  test('User not in database', async (done) => {
    let context = prepareContext();
    let request = httpRequest;
    request.headers.authorization = 'tim@gmail.org';
    request.body['id'] = '605b37ae6c35ab18d8c49da7';

    GetSupplierData(context as any, request as any);
    await timeout(context);

    expect(context.done).toEqual(true);
    expect(context.res.body).toBe('User invalid');
    expect(context.res.status).toBe(401);
    done();
  });
});

describe('Body checks', () => {
  test('Body is empty', async (done) => {
    let context = prepareContext();
    let request = httpRequest;
    request.headers.authorization = token;
    request.body = {};

    GetSupplierData(context as any, request as any);
    await timeout(context);

    expect(context.done).toEqual(true);
    expect(context.res.body).toBe('no body');
    expect(context.res.status).toBe(400);
    done();
  });

  test('Body is null', async (done) => {
    let context = prepareContext();
    let request = httpRequest;
    request.headers.authorization = token;
    request.body = null;

    GetSupplierData(context as any, request as any);
    await timeout(context);

    expect(context.done).toEqual(true);
    expect(context.res.body).toBe('no body');
    expect(context.res.status).toBe(400);
    done();
  });

  test('ID is invalid', async (done) => {
    let context = prepareContext();
    let request = httpRequest;
    request.headers.authorization = token;
    request.body = {};
    request.body['id'] = 'tulleId';

    GetSupplierData(context as any, request as any);
    await timeout(context);

    expect(context.done).toEqual(true);
    expect(context.res.body).toBe('ID recieved not valid format');
    expect(context.res.status).toBe(400);
    done();
  });

  test('ID is no supplier', async (done) => {
    let context = prepareContext();
    let request = httpRequest;
    request.headers.authorization = token;
    request.body = {};
    request.body['id'] = '123456789123456789123456';

    GetSupplierData(context as any, request as any);
    await timeout(context);

    expect(context.done).toEqual(true);
    expect(context.res.body).toBe('No supplier found');
    expect(context.res.status).toBe(400);
    done();
  });
});
