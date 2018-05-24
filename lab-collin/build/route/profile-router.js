'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _bodyParser = require('body-parser');

var _express = require('express');

var _httpErrors = require('http-errors');

var _httpErrors2 = _interopRequireDefault(_httpErrors);

var _profile = require('../model/profile');

var _profile2 = _interopRequireDefault(_profile);

var _bearerAuthMiddleware = require('../lib/bearer-auth-middleware');

var _bearerAuthMiddleware2 = _interopRequireDefault(_bearerAuthMiddleware);

var _logger = require('../lib/logger');

var _logger2 = _interopRequireDefault(_logger);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var jsonParser = (0, _bodyParser.json)();
var profileRouter = new _express.Router();

profileRouter.post('/profiles', _bearerAuthMiddleware2.default, jsonParser, function (request, response, next) {
  if (!request.account) {
    return next(new _httpErrors2.default(400, 'AUTH - invalid request'));
  }

  return new _profile2.default({
    pseudonym: request.body.pseudonym,
    persona: request.body.persona,
    catchphrase: request.body.catchphrase,
    visage: request.body.visage,
    account: request.account._id
  }).save().then(function (profile) {
    _logger2.default.log(_logger2.default.INFO, 'Returing a 200 and a new Profile');
    return response.json(profile);
  }).catch(next);
});

profileRouter.get('/profiles/:id', _bearerAuthMiddleware2.default, function (request, response, next) {
  if (!request.account) {
    return next(new _httpErrors2.default(400, 'AUTH - invalid request'));
  }
  if (!request.params.id) {
    return next(new _httpErrors2.default(400, 'AUTH - invalid request'));
  }
  return _profile2.default.findById(request.params.id).then(function (profile) {
    return response.json(profile);
  });
});

exports.default = profileRouter;