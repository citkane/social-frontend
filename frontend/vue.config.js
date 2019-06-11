module.exports = {
    devServer: {
        proxy: {
            '/ws/*': {
                target: 'ws://localhost:3000',
                ws: true,
                changeOrigin: true
            },
            '/login/': {
                target: 'http://localhost:3000',
                ws: true,
                changeOrigin: true

            },
            '/socket.io/': {
                target: 'http://localhost:3000',
                ws: true,
                changeOrigin: true
            },
            '/img/': {
                target: 'http://localhost:3000',
                ws: true,
                changeOrigin: true
            }
        }
    },
    runtimeCompiler: true
};
