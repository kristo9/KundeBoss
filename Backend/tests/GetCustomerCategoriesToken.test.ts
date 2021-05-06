import GetCustomerCategories from '../GetCustomerCategories/index';
import { prepareContext, httpRequest, timeout } from './sharedItems';
import { badToken, correctToken } from './tokens';

jest.unmock('jsonwebtoken');

describe('GetCustomerCategoriesToken', () => {
  test('Correct token', async (done) => {
    let context = prepareContext();
    let request = httpRequest;
    request.headers.authorization = correctToken;

    GetCustomerCategories(context as any, httpRequest as any);
    await timeout(context);

    expect(context.res.status).toEqual(200);
    done();
  });
});

describe('Should work as expected', () => {
  test('Bad token', async (done) => {
    let context = prepareContext();
    let request = httpRequest;
    request.headers.authorization = badToken;

    GetCustomerCategories(context as any, httpRequest as any);
    await timeout(context);
    
    expect(context.res.status).toEqual(401);
    done();
  });
});
