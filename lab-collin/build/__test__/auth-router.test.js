'use strict';

var _superagent = require('superagent');

var _superagent2 = _interopRequireDefault(_superagent);

var _server = require('../lib/server');

var _accountMock = require('./lib/account-mock');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var apiURL = 'http://localhost:' + process.env.PORT;

describe('AUTH Router', function () {
  beforeAll(_server.startServer);
  afterAll(_server.stopServer);
  afterEach(_accountMock.pRemoveAccountMock);

  // -----------CREATE ACCOUNT--------------------------

  test.only('POST should return a 200 status code and a TOKEN', function () {
    return _superagent2.default.post(apiURL + '/signup').send({
      username: 'goodboy',
      email: 'goodboy@works.com',
      password: 'great'
    }).then(function (response) {
      expect(response.status).toEqual(200);
      expect(response.body.token).toBeTruthy();
    });
  });

  test('POST should return a 400 status code', function () {
    return _superagent2.default.post(apiURL + '/signup').send({
      password: 'bad'
    }).then(Promise.reject).catch(function (response) {
      expect(response.status).toEqual(400);
    });
  });

  test('POST should return a 409 status code for duplicate email', function () {
    return (0, _accountMock.pCreateAccountMock)().then(function (account) {
      return _superagent2.default.post(apiURL + '/signup').send({
        username: account.request.username,
        email: account.request.email,
        password: account.request.password
      });
    }).then(Promise.reject).catch(function (err) {
      expect(err.status).toEqual(409);
    });
  });
});

// ---------------LOGIN--------------------

describe('GET /login', function () {
  beforeAll(_server.startServer);
  afterAll(_server.stopServer);
  test('GET /login should get a 200 status code and a TOKEN', function () {
    jest.setTimeout(20000);
    return (0, _accountMock.pCreateAccountMock)().then(function (mock) {
      return _superagent2.default.get(apiURL + '/login').auth(mock.request.username, mock.request.password);
    }).then(function (response) {
      expect(response.status).toEqual(200);
      expect(response.body.token).toBeTruthy();
    }).catch(function (err) {
      console.log(err);
      expect(err.status).toEqual(400);
    });
  });
});