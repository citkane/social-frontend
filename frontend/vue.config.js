const hostname = process.env.BFF_STATICPORT || '127.0.0.1';

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
        }
    }
};
