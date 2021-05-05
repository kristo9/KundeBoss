import GetCustomerData from '../GetCustomerData';
import { prepareContext, httpRequest, timeout } from './sharedItems';

describe('User credentials', () => {
  test('Should work as expected', async (done) => {
    let context = prepareContext();
    let request = httpRequest;
    request.headers.authorization = 'didrik.bjerk@kundeboss.onmicrosoft.com';
    request.body['id'] = '604a7ae0fe05bd49dcb6b7a1';

    GetCustomerData(context as any, httpRequest as any);
    await timeout(context);

    expect(context.done).toEqual(true);
    //expect(context.res.body).toHaveProperty('_id', '605b37ae6c35ab18d8c49da7');
    expect(context.res.status).toBe(200);
    done();
  });

  test('Unauthorized', async (done) => {
    let context = prepareContext();
    let request = httpRequest;
    request.headers.authorization = 'didrik.bjerk@live.no';
    request.body['id'] = '604a7ae0fe05bd49dcb6b7a1';

    GetCustomerData(context as any, httpRequest as any);
    await timeout(context);
    expect(context.done).toEqual(true);
    //expect(context.res.body).toHaveProperty('_id', '605b37ae6c35ab18d8c49da7');
    expect(context.res.status).toBe(401);
    done();
  });

  test('Made up emp id', async (done) => {
    let context = prepareContext();
    let request = httpRequest;
    request.headers.authorization = 'didri.bjerk@live.no';
    request.body['id'] = '604a7ae0fe05bd49dcb6b7a1';

    GetCustomerData(context as any, httpRequest as any);
    await timeout(context);
    expect(context.done).toEqual(true);
    //expect(context.res.body).toHaveProperty('_id', '605b37ae6c35ab18d8c49da7');
    expect(context.res.status).toBe(401);
    done();
  });
});

describe('Wrong customer id', () => {
  test('Error 400', async (done) => {
    let context = prepareContext();
    let request = httpRequest;
    request.headers.authorization = 'didrik.bjerk@kundeboss.onmicrosoft.com';
    request.body['id'] = '404a7ae0fe05bd49dcb6b7a1';

    GetCustomerData(context as any, httpRequest as any);
    await timeout(context);

    expect(context.done).toEqual(true);
    expect(context.res.status).toBe(400);
    done();
  });

  test('Emp ip not in db', async (done) => {
    let context = prepareContext();
    let request = httpRequest;
    request.headers.authorization = 'didri.bjerk@live.no';
    request.body['id'] = '404a7ae0fe05bd49dcb6b7a1';

    GetCustomerData(context as any, httpRequest as any);
    await timeout(context);
    expect(context.done).toEqual(true);
    expect(context.res.status).toBe(401);
    done();
  });
});
