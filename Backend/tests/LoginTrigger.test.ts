import LoginTrigger from '../LoginTrigger/index';
import DeleteEmployee from '../DeleteEmployee/index';
import { prepareContext, httpRequest, timeout, userAdmin, userNotAdmin } from './sharedItems';

describe('LoginTrigger function', () => {
  test('Test write admin configured', async (done) => {
    let context = prepareContext();
    let request = httpRequest;
    request.headers.authorization = userAdmin;

    LoginTrigger(context as any, request as any);
    await timeout(context);
    expect(context.done).toEqual(true);
    expect(context.res.status).toBe(200);
    expect(context.res.body.isConfigured).toBe(true);
    expect(context.res.body.admin).toBe('write');
    expect(context.res.body.isCustomer).toBe(false);

    done();
  });

  test('Test not configured, not first login', async (done) => {
    let context = prepareContext();
    let request = httpRequest;
    request.headers.authorization = userNotAdmin;

    LoginTrigger(context as any, request as any);
    await timeout(context);
    expect(context.done).toEqual(true);
    expect(context.res.status).toBe(200);
    expect(context.res.body.isConfigured).toBe(false);
    expect(context.res.body.admin).toBe(null);
    expect(context.res.body.isCustomer).toBe(false);
    expect(context.res.body.firstLogin).toBe(false);

    done();
  });

  test('Test first login and delete', async (done) => {
    let context = prepareContext();
    let request = httpRequest;
    request.headers.authorization = 'newk@false.emp.com';

    LoginTrigger(context as any, request as any);
    await timeout(context);

    expect(context.done).toEqual(true);
    expect(context.res.status).toBe(200);
    expect(context.res.body.isConfigured).toBe(false);
    expect(context.res.body.admin).toBe(null);
    expect(context.res.body.isCustomer).toBe(false);
    expect(context.res.body.firstLogin).toBe(true);

    request.body['id'] = context.res.body._id;
    request.headers.authorization = userAdmin;
    context = prepareContext();

    DeleteEmployee(context as any, request as any);
    await timeout(context);
    
    expect(context.res.body.deletedCount).toBe(1);
    expect(context.done).toEqual(true);

    done();
  });
});
