const hostname = process.env.BFF_STATICPORT || 'localhost';

module.exports = {
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
    },
    runtimeCompiler: true
};
