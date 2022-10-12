module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'main.js',
    library: {
      type: 'umd',
      name: 'main',
    },
    // INFO: prevent error: `Uncaught ReferenceError: self is not define`
    globalObject: 'this',
  },
};
