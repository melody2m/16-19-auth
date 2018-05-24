'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.pRemoveTreeMock = exports.pCreateTreeMock = undefined;

var _faker = require('faker');

var _faker2 = _interopRequireDefault(_faker);

var _accountMock = require('../lib/account-mock');

var _tree = require('../../model/tree');

var _tree2 = _interopRequireDefault(_tree);

var _account = require('../../model/account');

var _account2 = _interopRequireDefault(_account);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var pCreateTreeMock = function pCreateTreeMock() {
  var resultMock = {};
  return (0, _accountMock.pCreateAccountMock)().then(function (mockAcctResponse) {
    resultMock.accountMock = mockAcctResponse;

    return new _tree2.default({
      title: _faker2.default.lorem.words(5),
      url: _faker2.default.random.image(),
      account: resultMock.accountMock.account._id
    }).save();
  }).then(function (tree) {
    resultMock.tree = tree;
    return resultMock;
  });
};

var pRemoveTreeMock = function pRemoveTreeMock() {
  return Promise.all([_account2.default.remove({}), _tree2.default.remove({})]);
};

exports.pCreateTreeMock = pCreateTreeMock;
exports.pRemoveTreeMock = pRemoveTreeMock;