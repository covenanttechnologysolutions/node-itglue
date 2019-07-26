var path = require('path');
var config = {};


/*
  Build rules for webpack for browser based installation
 */

function getConfig(name) {
  var minimize = name.indexOf('min') > -1;
  var config = {
    mode: 'production',
    entry: './src/index.js',
    devtool: 'source-map',
    output: {
      path: path.join(__dirname, 'dist/'),
      filename: name + '.js',
      sourceMapFilename: name + '.js.map',
      libraryTarget: 'umd',
      library: 'node_itglue',
    },
    module: {
      rules: [{
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: [{
          loader: 'babel-loader',
        }],
      }],
    },
    optimization: {
      minimize: false,
    },
  };

  if (minimize) {
    config.optimization.minimize = true;
  }

  return config;
}

['node-itglue', 'node-itglue.min'].forEach(function (key) {
  config[key] = getConfig(key);
});

module.exports = config;
