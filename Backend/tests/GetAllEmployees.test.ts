const request = require('supertest');

const token =
  'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImtpZCI6Im5PbzNaRHJPRFhFSzFqS1doWHNsSFJfS1hFZyJ9.eyJhdWQiOiI2YmI1MDJjMy1jNDE2LTQ0ZjctOTdjYi03MDViMmIxYTUwYmEiLCJpc3MiOiJodHRwczovL2xvZ2luLm1pY3Jvc29mdG9ubGluZS5jb20vMzAxMDkxZjAtZTI0Zi00M2ZhLWJkODctNTkzNTBjYzNmYmI2L3YyLjAiLCJpYXQiOjE2MTUyMTE3NzAsIm5iZiI6MTYxNTIxMTc3MCwiZXhwIjoxNjE1MjE1NjcwLCJhaW8iOiJBVlFBcS84VEFBQUFhOGc3djNCdUkzZGZHNzZtTGhvNHEvSVJMSG9tV2VUaWRCSFVBOHRuRjhRV3hNb3JGMnJTNm1pWU1qVElrS2M1Vm5nNUF4K0k4YW5SYmhzV0tDbHVLcHEyVHhzdjF4UXIva00xV0U5eUJLdz0iLCJhenAiOiJjMDkwN2M2YS0zYjhmLTRlYjMtOTM0NS01YTFhMWI1ZjZlYTgiLCJhenBhY3IiOiIwIiwibmFtZSI6IsOYeXZpbmQgVGltaWFuIEQgSHVzdmVnIiwib2lkIjoiMmFlNTRmNzctODBiNS00M2JlLTg2ODctMWI0YTlhY2NjNzhiIiwicHJlZmVycmVkX3VzZXJuYW1lIjoib3l2aW5kLmh1c3ZlZ0BrdW5kZWJvc3Mub25taWNyb3NvZnQuY29tIiwicmgiOiIwLkFBQUE4SkVRTUVfaS1rTzloMWsxRE1QN3RtcDhrTUNQTzdOT2swVmFHaHRmYnFoNkFJUS4iLCJzY3AiOiJhY2Nlc3NfYXNfdXNlciIsInN1YiI6IkJzTnkycEtwdEtiendLUVZuUGZWdnZJXzROSFF1dU96REdVd3B4ZlhGRGciLCJ0aWQiOiIzMDEwOTFmMC1lMjRmLTQzZmEtYmQ4Ny01OTM1MGNjM2ZiYjYiLCJ1dGkiOiJOaTNWZENQMGIwNjlNeXU4RTg1TEFBIiwidmVyIjoiMi4wIn0.UxeL2KZ5fpP9UytQkXq74J7j70A0K6njiHnr394c2381BJ5VLSPcwSD4jSugwg1Iqz039aVmosRVgW2HFGwzP99ZjGPtND8V_RmG7oS1qVNC7E2OyAf6BpalgndUpdA_Zvh8kC_dXMl3evt3luqZejxFx4jA_GCrkDOAxMVA_RgTDjRgIs3jOfwvOq_GPC-vyvo4aNrFLjhswWAzc0YkUtNfJvxWenegpbbyp1-LOrPuCQlT1XmQTk-Qfe4RdleKcNyqoiADEd75ZsRsUq7LzFrHH00uqmybNZNnXow7uSSf_acYWh9BHW5j2e0bY6SDqYU2k7iUpUalP2-F_3te7A';
const employees = [
  {
    'name': 'Alexander A Jørgensen',
    'employeeId': 'alexander.jorgensen@kundeboss.onmicrosoft.com',
    'admin': null,
  },
  {
    'name': 'Kristoffer Haugen',
    'employeeId': 'kristoffer.haugen@kundeboss.onmicrosoft.com',
    'admin': null,
  },
  {
    'name': 'Øyvind Timian D Husveg',
    'employeeId': 'oyvind.husveg@kundeboss.onmicrosoft.com',
    'admin': 'write',
  },
  {
    'name': 'Por Arild R Johkfannesen',
    'employeeId': 'per.aasrud@kundeboss.onmicrosoft.com',
    'admin': 'write',
  },
  {
    'name': 'Didrik K Bjerk',
    'employeeId': 'didrik.bjerk@kundeboss.onmicrosoft.com',
    'admin': 'write',
  },
];

const server = 'https://kundebossfunctionapp.azurewebsites.net';

//https://github.com/visionmedia/supertest#readme

describe('POST /GetAllEmployees', () => {
  it('should return 200 & valid response to authorization with fakeToken request', async (done) => {
    request(server)
      .get('/api/GetAllEmployees')
      .authenticate({ tokens: { token: '', xsrfToken: '' } })
      .set('Authorization', token)
      .expect(200)
      .expect('Content-Type', 'text/html')
      .end(function (err, res) {
        if (err) return done(err);
        expect(res.body).toMatchObject({ employees });
        done();
      });
  });

  it('should return 401 & valid eror response to invalid authorization token', async (done) => {
    request(server)
      .get(`/api/GetAllEmployees`)
      .set('Authorization', 'Bearer 1234567890')
      //.expect('contentType', 'application/json')
      //.expect(401)
      .end(function (err, res) {
        if (err) return done(err);
        expect(res.body).toMatchObject({ message: 'Token not valid' });
        done();
      });
  });

  it('should return 401 & valid eror response to invalid permission level', async (done) => {
    request(server)
      .get(`/api/GetAllEmployees`)
      .set('Authorization', 'Bearer ' + token)
      .expect('contentType', 'text/html')
      .expect(401)
      .end(function (err, res) {
        if (err) return done(err);
        expect(res.body).toMatchObject({ message: 'User dont have admin-write permission' });
        done();
      });
  });

  it('should return 500 & should not happen?', async (done) => {
    request(server)
      .get(`/api/GetAllEmployees`)
      .set('Authorization', 'Bearer ' + token)
      .expect('contentType', 'text/html')
      .expect(401)
      .end(function (err, res) {
        if (err) return done(err);
        expect(res.body).toMatchObject({ message: 'Error running query' });
        done();
      });
  });
});
