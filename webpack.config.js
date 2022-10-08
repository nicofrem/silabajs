const path = require('path');

const serverConfig = {
  target: 'node',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'main.node.js',
    libraryTarget: 'umd',
  },
};

const clientConfig = {
  target: 'web',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'main.js',
    libraryTarget: 'umd',
  },
};

module.exports = [serverConfig, clientConfig];
