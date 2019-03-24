const {override} = require('customize-cra');
const cspHtmlWebpackPlugin = require("csp-html-webpack-plugin");

const cspConfigPolicy = {
    'default-src': "*  data: blob: 'unsafe-inline' 'unsafe-eval'",
    'base-uri': "'self'",
    'object-src': "'none'",
    'script-src': ["'self' 'https://code.jquery.com' 'https://cdnjs.cloudflare.com' 'https://stackpath.bootstrapcdn.com' 'https://cdn.jsdelivr.net' "],
    'style-src': ["'self' 'https://stackpath.bootstrapcdn.com' 'https://use.fontawesome.com' 'https://fonts.googleapis.com' 'https://npmcdn.com' '//cdn.quilljs.com'"]
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