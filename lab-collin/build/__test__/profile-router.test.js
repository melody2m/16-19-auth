'use strict';

var _superagent = require('superagent');

var _superagent2 = _interopRequireDefault(_superagent);

var _server = require('../lib/server');

var _accountMock = require('./lib/account-mock');

var _profileMock = require('./lib/profile-mock');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var apiURL = 'http://localhost:' + process.env.PORT;

describe('POST /profiles', function () {
  beforeAll(_server.startServer);
  afterAll(_server.stopServer);
  afterEach(_profileMock.pRemoveProfileMock);

  test('POST /profiles should get a 200 and the newly created profile', function () {
    var accountMock = null;
    return (0, _accountMock.pCreateAccountMock)().then(function (accountSetMock) {
      accountMock = accountSetMock;
      return _superagent2.default.post(apiURL + '/profiles').set('Authorization', 'Bearer ' + accountSetMock.token).send({
        catchphrase: 'none a yer business',
        pseudonym: 'joey',
        persona: 'shifty character'
      });
    }).then(function (response) {
      expect(response.status).toEqual(200);
      expect(response.body.account).toEqual(accountMock.account._id.toString());
      expect(response.body.pseudonym).toEqual('joey');
      expect(response.body.persona).toEqual('shifty character');
      expect(response.body.catchphrase).toEqual('none a yer business');
    });
  });

  test('POST /profiles with bad authorization should return 400 error', function () {
    var accountMock = null; // eslint-disable-line no-unused-vars
    return (0, _accountMock.pCreateAccountMock)().then(function (accountSetMock) {
      accountMock = accountSetMock;
      return _superagent2.default.post(apiURL + '/profiles').set('Authorization', 'Bearer BADAUTHORIZATION').send({
        catchphrase: 'this',
        pseudonym: 'dont',
        persona: 'post'
      });
    }).then(Promise.reject).catch(function (response) {
      expect(response.status).toEqual(400);
    });
  });
});

describe('GET /profiles:id', function () {
  beforeAll(_server.startServer);
  afterAll(_server.stopServer);
  afterEach(_profileMock.pRemoveProfileMock);

  test('GET /profiles:id should get a 200 and the specified profile', function () {
    return (0, _profileMock.pCreateProfileMock)().then(function (ProfileMock) {
      return _superagent2.default.get(apiURL + '/profiles/' + ProfileMock.profile._id).set('Authorization', 'Bearer ' + ProfileMock.accountSetMock.token);
    }).then(function (response) {
      expect(response.status).toEqual(200);
    });
  });

  test('GET /profiles with bad authorization should return 400 error', function () {
    return (0, _profileMock.pCreateProfileMock)().then(function (ProfileMock) {
      return _superagent2.default.get(apiURL + '/profiles/' + ProfileMock.profile._id).set('Authorization', 'Bearer BADAUTHORIZATION');
    }).then(Promise.reject).catch(function (response) {
      expect(response.status).toEqual(400);
    });
  });
});