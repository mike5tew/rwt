const { buffer } = require('stream/consumers');
const webpack = require('webpack');

module.exports = function override(config) {
    const fallback = config.resolve.fallback || {};
    Object.assign(fallback, { 
        zlib: require.resolve("browserify-zlib"),
        querystring: require.resolve("querystring-es3"),
        fs: false,
        crypto: require.resolve("crypto-browserify"),
        stream: require.resolve("stream-browserify"),
        http: require.resolve("stream-http") ,
        timers: require.resolve("timers-browserify"),
        tls: require.resolve("tls"),
        net: false,
        vm: require.resolve("vm-browserify"),
        buffer: require.resolve("buffer"), 
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
