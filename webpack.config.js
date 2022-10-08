const path = require('path');

const serverConfig = {
  target: 'node',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'silabajs.node.js',
  },
  // …
};

const clientConfig = {
  target: 'web',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'silabajs.js',
  },
  // …
};

module.exports = [serverConfig, clientConfig];
