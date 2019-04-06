const {override} = require('customize-cra');
const cspHtmlWebpackPlugin = require("csp-html-webpack-plugin");

const cspConfigPolicy = {
    'default-src': "'self'  data: blob: 'unsafe-inline' 'unsafe-eval' code.jquery.com cdnjs.cloudflare.com stackpath.bootstrapcdn.com stackpath.bootstrapcdn.com use.fontawesome.com fonts.googleapis.com npmcdn.com https://s3-ap-southeast-1.amazonaws.com/bulsu-capstone/ fonts.gstatic.com",
    'base-uri': "'self'",
    'object-src': "'none'",
    'script-src': ["'self' 'unsafe-inline' code.jquery.com cdnjs.cloudflare.com stackpath.bootstrapcdn.com"],
    'style-src': ["'self' 'unsafe-inline' stackpath.bootstrapcdn.com use.fontawesome.com fonts.googleapis.com npmcdn.com"]
};

function addCspHtmlWebpackPlugin(config) {
    if(process.env.NODE_ENV === 'production') {
        config.plugins.push(new cspHtmlWebpackPlugin(cspConfigPolicy));
    }

    return config;
}

module.exports = {
    webpack: override(addCspHtmlWebpackPlugin),
};