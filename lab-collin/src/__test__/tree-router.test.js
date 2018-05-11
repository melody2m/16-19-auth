'use strict';

import superagent from 'superagent';
import { startServer, stopServer } from '../lib/server';
import { pRemoveTreeMock, pCreateTreeMock } from './lib/tree-mock';

// set this to true or false depending on if you want to hit the mock AWS-SDK or if you want to hit the real AWS-SDK, i.e., upload an asset to your real bucket

const apiUrl = `http://localhost:${process.env.PORT}`;

describe('TESTING ROUTES AT /trees', () => {
  beforeAll(startServer);
  afterEach(pRemoveTreeMock);
  afterAll(stopServer);

  describe('POST 200 for successful post /trees', () => {
    test('should return 200 for sucessful tree post', () => {
      jest.setTimeout(20000);
      return pCreateTreeMock()
        .then((mockResponse) => {
          const { token } = mockResponse.accountMock;
          return superagent.post(`${apiUrl}/trees`)
            .set('Authorization', `Bearer ${token}`)
            .field('title', 'super tree')
            .attach('tree', `${__dirname}/asset/super_tree.jpg`)
            .then((response) => {
              expect(response.status).toEqual(200);
              expect(response.body.title).toEqual('super tree');
              expect(response.body._id).toBeTruthy();
              expect(response.body.url).toBeTruthy();
            });
        })
        .catch((err) => {
          console.log(err.message, 'ERR IN TEST');
          console.log(err.status, 'CODE ERR IN TEST');
          expect(err.status).toEqual(200);
        });
    });
  });
});
