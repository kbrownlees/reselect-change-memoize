
const path = require('path');

module.exports = {
  entry: './src/index.js',
  module: {
    rules: [{
      test: /\.js$/,
      use: ['babel-loader'],
      exclude: /node_modules/
    }]
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'reselect-change-memoize.js',
    library: 'reselectChangeMemoize',
    libraryTarget: 'umd',
  },
  externals: ['reselect']
};
