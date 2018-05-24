'use strict';

import { json } from 'body-parser';
import { Router } from 'express'; 
import HttpError from 'http-errors';
import Profile from '../model/profile';
import bearerAuthMiddleware from '../lib/bearer-auth-middleware';
import logger from '../lib/logger';

const jsonParser = json();
const profileRouter = new Router();

profileRouter.post('/profiles', bearerAuthMiddleware, jsonParser, (request, response, next) => {
  if (!request.account) {
    return next(new HttpError(400, 'AUTH - invalid request'));
  }

  return new Profile({
    pseudonym: request.body.pseudonym,
    persona: request.body.persona,
    catchphrase: request.body.catchphrase,
    visage: request.body.visage,
    account: request.account._id,
  })
    .save()
    .then((profile) => {
      logger.log(logger.INFO, 'Returing a 200 and a new Profile');
      return response.json(profile);
    })
    .catch(next);
});

profileRouter.get('/profiles/:id', bearerAuthMiddleware, (request, response, next) => {
  if (!request.account) {
    return next(new HttpError(400, 'AUTH - invalid request'));
  }
  if (!request.params.id) {
    return next(new HttpError(400, 'AUTH - invalid request'));
  }
  return Profile.findById(request.params.id)
    .then((profile) => {
      return response.json(profile);
    });
});

export default profileRouter;
