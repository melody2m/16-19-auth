'use strict';

const express = require('express');
const mongoose = require('mongoose');
const logger = require('./logger');
const authRoutes = require('../route/auth-router');
const profileRoutes = require('../route/profile-router');
const loggerMiddleware = require('./logger-middleware');
const treeRoutes = require('../route/tree-router');
const errorMiddleware = require('./error-middleware');

const app = express();
let server = null;

app.use(loggerMiddleware); 
app.use(authRoutes);
app.use(profileRoutes);
app.use(treeRoutes);

app.all('*', (request, response) => {
  logger.log(logger.INFO, 'Returning a 404 from the catch-all/default route');
  return response.sendStatus(404);
});

app.use(errorMiddleware);

const startServer = () => {
  return mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
      server = app.listen(process.env.PORT, () => {
        logger.log(logger.INFO, `Server is listening on port ${process.env.PORT}`);
      });
    });
};

const stopServer = () => {
  return mongoose.disconnect()
    .then(() => {
      server.close(() => {
        logger.log(logger.INFO, 'Server is off');
      });
    });
};

module.exports = { startServer, stopServer };
