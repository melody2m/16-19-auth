'use strict';

import superagent from 'superagent';
import { startServer, stopServer } from '../lib/server';
import { pCreateAccountMock, pRemoveAccountMock } from './lib/account-mock';


const apiURL = `http://localhost:${process.env.PORT}`;

describe('AUTH Router', () => {
  beforeAll(startServer);
  afterAll(stopServer);
  afterEach(pRemoveAccountMock);

  // -----------CREATE ACCOUNT--------------------------

  test.only('POST should return a 200 status code and a TOKEN', () => {
    return superagent.post(`${apiURL}/signup`)
      .send({
        username: 'goodboy',
        email: 'goodboy@works.com',
        password: 'great',
      })
      .then((response) => {
        expect(response.status).toEqual(200);
        expect(response.body.token).toBeTruthy();
      });
  });

  test('POST should return a 400 status code', () => {
    return superagent.post(`${apiURL}/signup`)
      .send({
        password: 'bad',
      })
      .then(Promise.reject)
      .catch((response) => {
        expect(response.status).toEqual(400);
      });
  });

  test('POST should return a 409 status code for duplicate email', () => {
    return pCreateAccountMock()
      .then((account) => {
        return superagent.post(`${apiURL}/signup`)
          .send({ 
            username: account.request.username,
            email: account.request.email,
            password: account.request.password,
          });
      })
      .then(Promise.reject)
      .catch((err) => {
        expect(err.status).toEqual(409);
      });
  });
});

// ---------------LOGIN--------------------

describe('GET /login', () => {
  beforeAll(startServer);
  afterAll(stopServer);
  test('GET /login should get a 200 status code and a TOKEN', () => {
    jest.setTimeout(20000);
    return pCreateAccountMock()
      .then((mock) => {                                                          
        return superagent.get(`${apiURL}/login`)
          .auth(mock.request.username, mock.request.password); 
      })
      .then((response) => {
        expect(response.status).toEqual(200);
        expect(response.body.token).toBeTruthy();
      })
      .catch((err) => {
        console.log(err);
        expect(err.status).toEqual(400);
      });
  });
});
