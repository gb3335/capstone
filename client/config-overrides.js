const {override} = require('customize-cra');
const cspHtmlWebpackPlugin = require("csp-html-webpack-plugin");

const cspConfigPolicy = {
    'default-src': "'self'  data: blob: 'unsafe-inline' 'unsafe-eval'",
    'base-uri': "'self'",
    'object-src': "'none'",
    'script-src': ["* data: blob: 'unsafe-inline' 'unsafe-eval'"],
    'style-src': ["*"],
    'img-src': "*",
    'font-src': "*"
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