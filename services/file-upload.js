const aws = require("aws-sdk");
const multer = require("multer");
const multerS3 = require("multer-s3");

const config = require("../config/s3keys");

aws.config.update({
  secretAccessKey: config.iamSecret,
  accessKeyId: config.iamUser,
  region: "us-east-2"
});

const s3 = new aws.S3();

const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: "bulsu-capstone",
    acl: "public-read",
    metadata: function(req, file, cb) {
      cb(null, { fieldName: "Test MetaData" });
    },
    key: function(req, file, cb) {
      cb(null, Date.now().toString() + ".png");
    }
  })
});

module.exports = upload;
