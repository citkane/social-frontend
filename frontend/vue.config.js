const hostname = process.env.BFF_HOST || '127.0.0.1';
const express = require('express');

module.exports = {
    runtimeCompiler: true,
    devServer: {
        proxy: {
            '/ws/*': {
                target: `ws://${hostname}:3000`,
                ws: true,
                changeOrigin: true
            },
            '/login/': {
                target: `http://${hostname}:3000`,
                ws: true,
                changeOrigin: true

            },
            '/socket.io/': {
                target: `http://${hostname}:3000`,
                ws: true,
                changeOrigin: true
            },
            '/img/': {
                target: `http://${hostname}:3000`,
                ws: true,
                changeOrigin: true
            }
        },
        before: (app) => {
            app.use('/docs', express.static('../../docs'));
        }
    },
    configureWebpack: {
        devtool: 'source-map',
        watchOptions: {
            ignored: ['dist', 'node_modules']
        }
    }
};
