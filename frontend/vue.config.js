module.exports = {
    devServer: {
        proxy: {
            '/ws/*': {
                target: 'ws://localhost:3000',
                ws: true,
                changeOrigin: true
            },
            '/*': {
                target: 'http://localhost:3000',
                ws: true,
                changeOrigin: true
            }
        }
    },
    runtimeCompiler: true
};
