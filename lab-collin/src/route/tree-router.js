'use strict';

import multer from 'multer';
import { Router } from 'express';
import HttpError from 'http-errors';
import bearerAuthMiddleWare from '../lib/bearer-auth-middleware';
import Tree from '../model/tree';
import { s3Upload, s3Remove, s3Get } from '../lib/s3';
import logger from '../lib/logger';

const multerUpload = multer({ dest: `${__dirname}/../temp` });

const treeRouter = new Router();

treeRouter.post('/trees', bearerAuthMiddleWare, multerUpload.any(), (request, response, next) => {
  if (!request.account) {
    return next(new HttpError(404, 'TREE ROUTER _ERROR_, not found'));
  }

  if (!request.body.title || request.files.length > 1 || request.files[0].fieldname !== 'tree') {
    return next(new HttpError(400, 'TREE ROUTER __ERROR__ invalid request'));
  }

  const file = request.files[0];
  const key = `${file.filename}.${file.originalname}`;

  return s3Upload(file.path, key)
    .then((url) => {
      return new Tree({
        title: request.body.title,
        account: request.account._id,
        url,
      }).save();
    })
    .then(tree => response.json(tree))
    .catch(next);
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

export default treeRouter;

