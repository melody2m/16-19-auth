'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _multer = require('multer');

var _multer2 = _interopRequireDefault(_multer);

var _express = require('express');

var _httpErrors = require('http-errors');

var _httpErrors2 = _interopRequireDefault(_httpErrors);

var _bearerAuthMiddleware = require('../lib/bearer-auth-middleware');

var _bearerAuthMiddleware2 = _interopRequireDefault(_bearerAuthMiddleware);

var _tree = require('../model/tree');

var _tree2 = _interopRequireDefault(_tree);

var _s = require('../lib/s3');

var _logger = require('../lib/logger');

var _logger2 = _interopRequireDefault(_logger);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var multerUpload = (0, _multer2.default)({ dest: __dirname + '/../temp' });

var treeRouter = new _express.Router();

treeRouter.post('/trees', _bearerAuthMiddleware2.default, multerUpload.any(), function (request, response, next) {
  if (!request.account) {
    return next(new _httpErrors2.default(404, 'TREE ROUTER _ERROR_, not found'));
  }

  if (!request.body.title || request.files.length > 1 || request.files[0].fieldname !== 'tree') {
    return next(new _httpErrors2.default(400, 'TREE ROUTER __ERROR__ invalid request'));
  }

  var file = request.files[0];
  var key = file.filename + '.' + file.originalname;

  return (0, _s.s3Upload)(file.path, key).then(function (url) {
    return new _tree2.default({
      title: request.body.title,
      account: request.account._id,
      url: url
    }).save();
  }).then(function (tree) {
    return response.json(tree);
  }).catch(next);
});

treeRouter.get('/trees/:id', _bearerAuthMiddleware2.default, function (request, response, next) {
  if (!request.account) {
    return next(new _httpErrors2.default(404, 'TREE ROUTER _ERROR_, not found'));
  }

  if (!request.params.id) {
    return next(new _httpErrors2.default(400, 'TREE ROUTER __ERROR__ invalid request'));
  }

  return _tree2.default.findById(request.params.id).then(function (tree) {
    if (!tree) {
      _logger2.default.log(_logger2.default.ERROR, 'tree ROUTER: responding with 404 status code !tree');
      return next(new _httpErrors2.default(404, 'tree not found'));
    }

    _logger2.default.log(_logger2.default.INFO, 'tree ROUTER: responding with 200 status code');
    _logger2.default.log(_logger2.default.INFO, 'tree ROUTER: ' + JSON.stringify(tree));
    return response.json(tree);
  }).catch(next);
});

treeRouter.delete('/trees/:id', _bearerAuthMiddleware2.default, function (request, response, next) {
  if (!request.account) {
    return next(new _httpErrors2.default(404, 'TREE ROUTER _ERROR_, not found'));
  }

  if (!request.params.id) {
    return next(new _httpErrors2.default(400, 'TREE ROUTER __ERROR__ invalid request'));
  }

  return _tree2.default.findByIdAndRemove(request.params.id).then(function (tree) {
    return (0, _s.s3Remove)(tree.filename).then(function () {
      return response.sendStatus(204);
    });
  });
});

exports.default = treeRouter;