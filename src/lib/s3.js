'use strict';

import fs from 'fs-extra';


const s3Upload = (path, key) => {
  const aws = require('aws-sdk');
  const amazonS3 = new aws.S3();
  const uploadOptions = {
    Bucket: process.env.AWS_BUCKET,
    Key: key,
    ACL: 'public-read',
    Body: fs.createReadStream(path), 
  };
  return amazonS3.upload(uploadOptions)
    .promise() 
    .then((response) => {
      return fs.remove(path)
        .then(() => response.Location)
        .catch(err => Promise.reject(err));
    })
    .catch((err) => {
      return fs.remove(path)
        .then(() => Promise.reject(err))
        .catch(fsErr => Promise.reject(fsErr));
    });
};

const s3Remove = (key) => {
  const aws = require('aws-sdk');
  const amazonS3 = new aws.S3();
  const removeOptions = {
    Key: key,
    Bucket: process.env.AWS_BUCKET,
  };

  return amazonS3.deleteObject(removeOptions).promise();
};

const s3Get = (key) => {
  const aws = require('aws-sdk');
  const amazonS3 = new aws.S3();
  const getOptions = {
    Key: key,
    Bucket: process.env.AWS_BUCKET,
  };

  return amazonS3.getObject(getOptions).promise();
};

export { s3Upload, s3Remove, s3Get };

