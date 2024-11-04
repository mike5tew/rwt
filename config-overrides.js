const { buffer } = require('stream/consumers');
const webpack = require('webpack');
// to fix the error listed blow
// TypeError: Cannot read properties of undefined (reading 'prototype')


module.exports = function override(config) {
    //do stuff with the webpack config
    const fallback = config.resolve.fallback || {};
    Object.assign(fallback, { 
        buffer: require.resolve('buffer/'),
        stream: require.resolve('stream-browserify'),
        crypto: require.resolve('crypto-browserify'),
        util: require.resolve('util/'),
        assert: require.resolve('assert/'),
        process: require.resolve('process/browser'),
        http: require.resolve('stream-http'),
        querystring: require.resolve('querystring-es3'),
        timers: require.resolve('timers-browserify'),
        zlib: require.resolve('browserify-zlib'),
        fs: false,
        os: false,
        
    });
    config.resolve.fallback = fallback;
    config.plugins = (config.plugins || []).concat([
        new webpack.ProvidePlugin({
            process: 'process/browser',
            Buffer: ['buffer', 'Buffer'],
        }),
    ]);
//    console.log('config.resolve.fallback:::', config.resolve.fallback)
    return config;
}
// do I need to edit this file to fix this err... Cannot read properties of undefined (reading 'prototype')
// TypeError: Cannot read properties of undefined (reading 'prototype')
//     at Object.<anonymous> (C:\Users\user\Documents\GitHub\react-portfolio\node_modules\buffer\index.js:8:44)
// to fix this error I need to add the following code to the config-overrides.js file
// const { buffer } = require('stream/consumers');
// const webpack = require('webpack');