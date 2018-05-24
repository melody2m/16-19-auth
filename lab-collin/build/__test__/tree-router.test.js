'use strict';

var _superagent = require('superagent');

var _superagent2 = _interopRequireDefault(_superagent);

var _server = require('../lib/server');

var _treeMock = require('./lib/tree-mock');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var apiUrl = 'http://localhost:' + process.env.PORT;

describe('TESTING ROUTES AT /trees', function () {
  beforeAll(_server.startServer);
  afterEach(_treeMock.pRemoveTreeMock);
  afterAll(_server.stopServer);

  // -----POST-----

  describe('POST 200 for successful post /trees', function () {
    test.only('should return 200 for sucessful tree post', function () {
      jest.setTimeout(20000);
      return (0, _treeMock.pCreateTreeMock)().then(function (mockResponse) {
        var token = mockResponse.accountMock.token;

        return _superagent2.default.post(apiUrl + '/trees').set('Authorization', 'Bearer ' + token).field('title', 'super tree').attach('tree', __dirname + '/lib/asset/super_tree.jpg').then(function (response) {
          expect(response.status).toEqual(200);
          expect(response.body.title).toEqual('super tree');
          expect(response.body._id).toBeTruthy();
          expect(response.body.url).toBeTruthy();
        });
      }).catch(function (err) {
        console.log(err.message, 'ERR IN TEST');
        console.log(err.status, 'CODE ERR IN TEST');
        expect(err.status).toEqual(400);
      });
    });

    test('should return 400 for failed validation', function () {
      jest.setTimeout(20000).then(function () {
        return _superagent2.default.post(apiUrl + '/trees').set('Authorization', 'No Authorization Here!').field('title', 'super tree').attach('tree', __dirname + '/lib/asset/super_tree.jpg').catch(function (response) {
          expect(response.status).toEqual(400);
        });
      });
    });
  });

  // -----GET-----

  describe('GET 200 for successful get /trees', function () {
    test('should return 200 for sucessful tree get', function () {
      jest.setTimeout(20000);
      return (0, _treeMock.pCreateTreeMock)().then(function (mockResponse) {
        var token = mockResponse.accountMock.token;

        return _superagent2.default.get(apiUrl + '/trees/' + mockResponse._id).set('Authorization', 'Bearer ' + token).then(function (response) {
          expect(response.status).toEqual(200);
          expect(response.body.title).toEqual('super tree');
          expect(response.body._id).toBeTruthy();
          expect(response.body.url).toBeTruthy();
        });
      }).catch(function (err) {
        console.log(err.message, 'ERR IN TEST');
        console.log(err.status, 'CODE ERR IN TEST');
        expect(err.status).toEqual(400);
      });
    });
  });

  // -----DELETE-----

  describe('DELETE 204 for successful delete /trees', function () {
    test('should return 204 for sucessful tree delete', function () {
      jest.setTimeout(20000);
      return (0, _treeMock.pCreateTreeMock)().then(function (mockResponse) {
        var token = mockResponse.accountMock.token;

        return _superagent2.default.delete(apiUrl + '/trees/' + mockResponse._id).set('Authorization', 'Bearer ' + token).then(function (response) {
          expect(response.status).toEqual(204);
        });
      }).catch(function (err) {
        console.log(err.message, 'ERR IN TEST');
        console.log(err.status, 'CODE ERR IN TEST');
        expect(err.status).toEqual(400);
      });
    });
  });
});