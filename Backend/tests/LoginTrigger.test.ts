import LoginTrigger from '../LoginTrigger/index';
import { prepareContext, httpRequest, timeout } from './sharedItems';

describe('LoginTrigger function', () => {
  test('Test write admin configured', async (done) => {
    let context = prepareContext();
    let request = httpRequest;
    request.headers.authorization = 'didrik.bjerk@kundeboss.onmicrosoft.com';

    LoginTrigger(context as any, httpRequest as any);
    await timeout(context);
    expect(context.done).toEqual(true);
    expect(context.res.status).toBe(200);
    expect(context.res.body.isConfigured).toBe(true);
    expect(context.res.body.admin).toBe('write');
    expect(context.res.body.isCustomer).toBe(false);

    done();
  });

  test('Test write admin configured', async (done) => {
    let context = prepareContext();
    let request = httpRequest;
    request.headers.authorization = 'didrik.bjerk@false.emp.com';

    LoginTrigger(context as any, httpRequest as any);
    await timeout(context);
    expect(context.done).toEqual(true);
    expect(context.res.status).toBe(200);
    expect(context.res.body.isConfigured).toBe(false);
    expect(context.res.body.admin).toBe(null);
    expect(context.res.body.isCustomer).toBe(false);
    done();
  });
});
