import GetAllEmployees from '../GetAllEmployees/index';
import { prepareContext, httpRequest, timeout } from './sharedItems';

describe('User credentials', () => {
  test('Should work as expected', async (done) => {
    let context = prepareContext();
    let request = httpRequest;
    request.headers.authorization = 'oyvind.husveg@kundeboss.onmicrosoft.com';

    GetAllEmployees(context as any, httpRequest as any);
    await timeout(context);

    expect(context.res.status).toEqual(200);
    done();
  });

  it('Userid doesnt have sufficient permission', async (done) => {
    let context = prepareContext();
    let request = httpRequest;
    request.headers.authorization = 'timTest@flyt.cloud';

    GetAllEmployees(context as any, httpRequest as any);
    await timeout(context);

    expect(context.res.status).toBe(401);
    done();
  });

  it('Userid not in database', async (done) => {
    let context = prepareContext();
    let request = httpRequest;
    request.headers.authorization = 'timTest333@gmail.net';

    GetAllEmployees(context as any, httpRequest as any);
    await timeout(context);

    expect(context.res.status).toBe(401);
    done();
  });
});
