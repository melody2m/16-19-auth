'use strict';

import superagent from 'superagent';
import { startServer, stopServer } from '../lib/server';
import { pCreateAccountMock } from './lib/account-mock';
import { pCreateProfileMock, pRemoveProfileMock } from './lib/profile-mock';

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
            catchphrase: 'none a yer business',
            pseudonym: 'joey',
            persona: 'shifty character',
          });
      })
      .then((response) => {
        expect(response.status).toEqual(200);
        expect(response.body.account).toEqual(accountMock.account._id.toString());
        expect(response.body.pseudonym).toEqual('joey');
        expect(response.body.persona).toEqual('shifty character');
        expect(response.body.catchphrase).toEqual('none a yer business');
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
      .then(Promise.reject)
      .catch((response) => {
        expect(response.status).toEqual(400);
      });
  });
});

describe('GET /profiles:id', () => {
  beforeAll(startServer);
  afterAll(stopServer);
  afterEach(pRemoveProfileMock);
  
  test('GET /profiles:id should get a 200 and the specified profile', () => {
    return pCreateProfileMock()
      .then((ProfileMock) => {
        return superagent.get(`${apiURL}/profiles/${ProfileMock.profile._id}`)
          .set('Authorization', `Bearer ${ProfileMock.accountSetMock.token}`);
      })
      .then((response) => {
        expect(response.status).toEqual(200);
      });
  });

  test('GET /profiles with bad authorization should return 400 error', () => {
    return pCreateProfileMock()
      .then((ProfileMock) => {
        return superagent.get(`${apiURL}/profiles/${ProfileMock.profile._id}`)
          .set('Authorization', 'Bearer BADAUTHORIZATION');
      })
      .then(Promise.reject)
      .catch((response) => {
        expect(response.status).toEqual(400);
      });
  });
});
