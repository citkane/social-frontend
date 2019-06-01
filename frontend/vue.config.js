module.exports = {
  devServer: {
    proxy: {
      '/ws/*': {
        target: 'ws://localhost:3000',
        ws: true,
      },
      '/*': {
        target: 'http://localhost:3000',
      },
    },
  },
  runtimeCompiler: true,
};
