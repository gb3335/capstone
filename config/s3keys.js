if (process.env.NODE_ENV === "production") {
  module.exports = require("./s3keys_prod");
} else {
  module.exports = require("./s3keys_dev");
}
