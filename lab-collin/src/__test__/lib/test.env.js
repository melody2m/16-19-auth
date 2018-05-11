process.env.NODE_ENV = 'development';
process.env.PORT = 7000;
process.env.MONGODB_URI = 'mongodb://localhost/testing';
process.env.TREES_SECRET = 'fake secret';

const isAwsMock = true;

if (isAwsMock) {
  process.env.AWS_BUCKET = 'fake';
  process.env.AWS_SECRET_ACCESS_KEY = 'totallyfake';
  process.env.AWS_ACCESS_KEY_ID = 'notreal';
  require('./setup');
} else {
  require('dotenv').config();
}
