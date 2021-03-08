const request = require('supertest');
//const express = require('express');

const token = process.env.TOKENBEARER;

const server = 'https://kundebossblobstorage.z6.web.core.windows.net/'; //express();

//https://github.com/visionmedia/supertest#readme

describe('POST /GetAllEmployees', () => {
  it('should return 200 & valid response to authorization with fakeToken request', async (done) => {
    request(server)
      .get(`/api/GetAllEmployees`)
      .set('Authorization', 'Bearer ' + token)
      .expect('Content-Type', /json/)
      .expect(200)
      .end(function (err, res) {
        if (err) return done(err);
        expect(res.body).toMatchObject({ 'message': 'Goodbye, fakeUserId!' });
        done();
      });
  });

  it('should return 401 & valid eror response to invalid authorization token', async (done) => {
    request(server)
      .get(`/api/v1/goodbye`)
      .set('Authorization', 'Bearer invalidFakeToken')
      .expect('Content-Type', /json/)
      .expect(401)
      .end(function (err, res) {
        if (err) return done(err);
        expect(res.body).toMatchObject({ error: { type: 'unauthorized', message: 'Authentication Failed' } });
        done();
      });
  });

  it('should return 401 & valid eror response to invalid permission level', async (done) => {
    request(server)
      .get(`/api/v1/goodbye`)
      .set('Authorization', 'Bearer invalidFakeToken')
      .expect('Content-Type', /json/)
      .expect(401)
      .end(function (err, res) {
        if (err) return done(err);
        expect(res.body).toMatchObject({ error: { type: 'unauthorized', message: 'Authentication Failed' } });
        done();
      });
  });

  it('should return 500 & should not happen?', async (done) => {
    request(server)
      .get(`/api/v1/goodbye`)
      .set('Authorization', 'Bearer invalidFakeToken')
      .expect('Content-Type', /json/)
      .expect(401)
      .end(function (err, res) {
        if (err) return done(err);
        expect(res.body).toMatchObject({ error: { type: 'unauthorized', message: 'Authentication Failed' } });
        done();
      });
  });
});
