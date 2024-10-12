const webpack = require('webpack');

module.exports = function override(config) {
    const fallback = config.resolve.fallback || {};
    Object.assign(fallback, { 
        zlib: require.resolve("browserify-zlib"),
        querystring: require.resolve("querystring-es3"),
        crypto: require.resolve("crypto-browserify"),
        stream: require.resolve("stream-browserify"),
        http: require.resolve("stream-http") ,
        timers: require.resolve("timers-browserify"),
        fs: require.resolve("fs"),
        net: false
    });
    config.resolve.fallback = fallback;
    config.plugins = (config.plugins || []).concat([
        new webpack.ProvidePlugin({
            process: 'process/browser',
        }),
    ]);
    return config;
}
// console.log(config.resolve.fallback:::  + config.resolve.fallback)

