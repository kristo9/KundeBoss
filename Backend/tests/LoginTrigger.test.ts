import LoginTrigger from '../LoginTrigger/index';
import { prepareContext, httpRequest, timeout } from './sharedItems';

describe('LoginTrigger function', () => {
  test('LoginTrigger', async (done) => {
    let context = prepareContext();
    let request = httpRequest;
    request.headers.authorization = 'didrik.bjerk@kundeboss.onmicrosoft.com';

    LoginTrigger(context as any, httpRequest as any);
    await timeout(context);

    expect(context.res.status).toBe(200);
    done();
  });
});
