'use strict';

import superagent from 'superagent';
import { startServer, stopServer } from '../lib/server';
import { pCreateAccountMock } from './lib/account-mock';
import { pRemoveProfileMock } from './lib/profile-mock';

const apiURL = `http://localhost:${process.env.PORT}`;

describe('POST /profiles', () => {
  beforeAll(startServer);
  afterAll(stopServer);
  afterEach(pRemoveProfileMock);

  test('POST /profiles should get a 200 and the newly created profile', () => {
    let accountMock = null;
    return pCreateAccountMock()
      .then((accountSetMock) => {
        accountMock = accountSetMock;
        return superagent.post(`${apiURL}/profiles`)
          .set('Authorization', `Bearer ${accountSetMock.token}`)
          .send({
            catchphrase: 'yolo',
            pseudonym: 'joe',
            persona: 'barber',
          });
      })
      .then((response) => {
        expect(response.status).toEqual(200);
        expect(response.body.account).toEqual(accountMock.account._id.toString());
        expect(response.body.pseudonym).toEqual('joe');
        expect(response.body.persona).toEqual('barber');
        expect(response.body.catchphrase).toEqual('yolo');
      });
  });

  test('POST /profiles with bad authorization should return 400 error', () => {
    let accountMock = null; // eslint-disable-line no-unused-vars
    return pCreateAccountMock()
      .then((accountSetMock) => {
        accountMock = accountSetMock;
        return superagent.post(`${apiURL}/profiles`)
          .set('Authorization', 'Bearer BADAUTHORIZATION')
          .send({
            catchphrase: 'this',
            pseudonym: 'dont',
            persona: 'post',
          });
      })
      .then((response) => {
        expect(response.status).toEqual(400);
      });
  });
});
