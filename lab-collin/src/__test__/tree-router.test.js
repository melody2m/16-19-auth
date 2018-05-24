'use strict';

import superagent from 'superagent';
import { startServer, stopServer } from '../lib/server';
import { pRemoveTreeMock, pCreateTreeMock } from './lib/tree-mock';

const apiUrl = `http://localhost:${process.env.PORT}`;

describe('TESTING ROUTES AT /trees', () => {
  beforeAll(startServer);
  afterEach(pRemoveTreeMock);
  afterAll(stopServer);

  // -----POST-----

  describe('POST 200 for successful post /trees', () => {
    test('should return 200 for sucessful tree post', () => {
      jest.setTimeout(20000);
      return pCreateTreeMock()
        .then((mockResponse) => {
          const { token } = mockResponse.accountMock;
          return superagent.post(`${apiUrl}/trees`)
            .set('Authorization', `Bearer ${token}`)
            .field('title', 'super tree')
            .attach('tree', `${__dirname}/lib/asset/super_tree.jpg`)
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
          expect(err.status).toEqual(400);
        });
    });

    test('should return 400 for failed validation', () => {
      jest.setTimeout(20000)
        .then(() => {
          return superagent.post(`${apiUrl}/trees`)
            .set('Authorization', 'No Authorization Here!')
            .field('title', 'super tree')
            .attach('tree', `${__dirname}/lib/asset/super_tree.jpg`)
            .catch((response) => {
              expect(response.status).toEqual(400);
            });
        });
    });
  });
});

// -----GET-----

// describe('GET 200 for successful get /trees', () => {
//   test('should return 200 for sucessful tree get', () => {
//     jest.setTimeout(20000);
//     return pCreateTreeMock()
//       .then((mockResponse) => {
//         const { token } = mockResponse.accountMock;
//         return superagent.get(`${apiUrl}/trees/${mockResponse._id}`)
//           .set('Authorization', `Bearer ${token}`)
//           .then((response) => {
//             expect(response.status).toEqual(200);
//             expect(response.body.title).toEqual('super tree');
//             expect(response.body._id).toBeTruthy();
//             expect(response.body.url).toBeTruthy();
//           });
//       })
//       .catch((err) => {
//         console.log(err.message, 'ERR IN TEST');
//         console.log(err.status, 'CODE ERR IN TEST');
//         expect(err.status).toEqual(400);
//       });
//   });
// });

// // -----DELETE-----

// describe('DELETE 204 for successful delete /trees', () => {
//   test('should return 204 for sucessful tree delete', () => {
//     jest.setTimeout(20000);
//     return pCreateTreeMock()
//       .then((mockResponse) => {
//         const { token } = mockResponse.accountMock;
//         return superagent.delete(`${apiUrl}/trees/${mockResponse._id}`)
//           .set('Authorization', `Bearer ${token}`)
//           .then((response) => {
//             expect(response.status).toEqual(204);
//           });
//       })
//       .catch((err) => {
//         console.log(err.message, 'ERR IN TEST');
//         console.log(err.status, 'CODE ERR IN TEST');
//         expect(err.status).toEqual(400);
//       });
//   });
// });
