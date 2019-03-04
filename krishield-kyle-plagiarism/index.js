// index.js inside the addon project.
const binary = require('node-pre-gyp');
const path = require('path');
const binding_path = binary.find(
  path.resolve(path.join(__dirname, './package.json'))
);
const binding = require(binding_path);

// ./node_modules/.bin/node-pre-gyp package publish --config node-pre-gyp.config

module.exports = binding;
