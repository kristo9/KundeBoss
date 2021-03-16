const GetAllEmployees = require('../GetAllEmployees');
import { connectRead } from '../SharedFiles/dataBase';
jest.mock('../SharedFiles/dataBase');

const token =
  'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImtpZCI6Im5PbzNaRHJPRFhFSzFqS1doWHNsSFJfS1hFZyJ9.eyJhdWQiOiI2YmI1MDJjMy1jNDE2LTQ0ZjctOTdjYi03MDViMmIxYTUwYmEiLCJpc3MiOiJodHRwczovL2xvZ2luLm1pY3Jvc29mdG9ubGluZS5jb20vMzAxMDkxZjAtZTI0Zi00M2ZhLWJkODctNTkzNTBjYzNmYmI2L3YyLjAiLCJpYXQiOjE2MTUyOTgzNjMsIm5iZiI6MTYxNTI5ODM2MywiZXhwIjoxNjE1MzAyMjYzLCJhaW8iOiJBVFFBeS84VEFBQUErK3F6dDZhUDd6Y0E3QTdnWVdsYitkNzBoODlacXNwVUxUM2V4c3YraXQ4VG5CU0Q5K2N3MnFkeDFVenQ4M2xYIiwiYXpwIjoiYzA5MDdjNmEtM2I4Zi00ZWIzLTkzNDUtNWExYTFiNWY2ZWE4IiwiYXpwYWNyIjoiMCIsIm5hbWUiOiLDmHl2aW5kIFRpbWlhbiBEIEh1c3ZlZyIsIm9pZCI6IjJhZTU0Zjc3LTgwYjUtNDNiZS04Njg3LTFiNGE5YWNjYzc4YiIsInByZWZlcnJlZF91c2VybmFtZSI6Im95dmluZC5odXN2ZWdAa3VuZGVib3NzLm9ubWljcm9zb2Z0LmNvbSIsInJoIjoiMC5BQUFBOEpFUU1FX2kta085aDFrMURNUDd0bXA4a01DUE83Tk9rMFZhR2h0ZmJxaDZBSVEuIiwic2NwIjoiYWNjZXNzX2FzX3VzZXIiLCJzdWIiOiJCc055MnBLcHRLYnp3S1FWblBmVnZ2SV80TkhRdXVPekRHVXdweGZYRkRnIiwidGlkIjoiMzAxMDkxZjAtZTI0Zi00M2ZhLWJkODctNTkzNTBjYzNmYmI2IiwidXRpIjoiNDNxRzRId3YzMFNVQW8xMmNqUmRBQSIsInZlciI6IjIuMCJ9.eK6EitrMmA0TZtEVToRUHjML58lyA4emutMVh6dw20n4f0BGnhe5ulqxTkzOVksXAnjG6NgD13mw_uBrFXa3lBVxTOZ3jFckoV95NsU934KtOG6yEAhC_4ZQs_2DvBpBmqd2KzBwEik9hYLErDoZHyg9MJXkumpOOqRu1TYF2XGfe6Fwf2qEObuH9bBhQFZCkPy4eJ-WketLKUEG2lOW9WkcIGM0z8wbHTxHxjELqdhiKbDafD4J_dNQxIq2AfEaSJWSCg4CVqoa04ejgWwY8IP4cckCDsu3hQUzJLbXyRkqH__yPqeaBWb1WRQwiuYSNmFm0RoPD7eKjCgDDm_aCQ';

let request = {
  method: 'POST', // HTTP request method used to invoke this function.
  url: null, // Request URL
  headers: { 'authorization': 'Bearer ' + token }, // HTTP request headers.
  query: {}, // Query string parameter keys and values from the URL.
  params: null, // Route parameter keys and values.
  body: null, // The HTTP request body.
};

describe('GetAllEmployees function', () => {
  beforeEach(() => {});

  test('status should return 200', async () => {
    let context = { log: jest.fn(), done: jest.fn(), res: { status: null, body: null } };
    console.log('Going in');
    await GetAllEmployees(context, request);
    console.log('Going out');
    console.log(context.res.body);

    expect(context.res.status).toEqual(200);
    expect(context.done).toHaveBeenCalledTimes(1);
  });
});
