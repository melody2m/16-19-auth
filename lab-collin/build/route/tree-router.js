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

// treeRouter.get('/trees/:id', bearerAuthMiddleWare, (request, response, next) => {
//   if (!request.account) {
//     return next(new HttpError(404, 'TREE ROUTER _ERROR_, not found'));
//   }

//   if (!request.params.id) {
//     return next(new HttpError(400, 'TREE ROUTER __ERROR__ invalid request'));
//   }

//   return Tree.findById(request.params.id)
//     .then((tree) => {
//       if (!tree) {
//         logger.log(logger.ERROR, 'tree ROUTER: responding with 404 status code !tree');
//         return next(new HttpError(404, 'tree not found'));
//       }

//       logger.log(logger.INFO, 'tree ROUTER: responding with 200 status code');
//       logger.log(logger.INFO, `tree ROUTER: ${JSON.stringify(tree)}`);
//       return response.json(tree);
//     })
//     .catch(next);
// });

// treeRouter.delete('/trees/:id', bearerAuthMiddleWare, (request, response, next) => {
//   if (!request.account) {
//     return next(new HttpError(404, 'TREE ROUTER _ERROR_, not found'));
//   }

//   if (!request.params.id) {
//     return next(new HttpError(400, 'TREE ROUTER __ERROR__ invalid request'));
//   }

//   return Tree.findByIdAndRemove(request.params.id)
//     .then((tree) => {
//       return s3Remove(tree.filename)
//         .then(() => {
//           return response.sendStatus(204);
//         });
//     });
// });

exports.default = treeRouter;