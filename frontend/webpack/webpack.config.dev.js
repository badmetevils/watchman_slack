const Webpack = require('webpack');
const merge = require('webpack-merge');
const common = require('./webpack.common.js');

const { ENDPOINTS } = require('./cliargs');

module.exports = merge(common, {
  mode: 'development',
  devtool: 'cheap-eval-source-map',
  output: {
    chunkFilename: '[name].chunk.js',
    libraryTarget: 'umd',
    globalObject: 'window'
  },

  devServer: {
    port: 4200,
    inline: true,
    overlay: true
  },
  plugins: [
    new Webpack.DefinePlugin({
      NODE_ENV: JSON.stringify('development'),
      APP_ENV: ENDPOINTS
    })
  ],
  module: {
    rules: [
      {
        test: /\.s?css$/i,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              modules: {
                mode: resourcePath => {
                  if (resourcePath.includes('.module.')) {
                    return 'local';
                  }
                  return 'global';
                },
                exportGlobals: true,
                localIdentName: '[path][name]__[local]--[hash:base64:5]'
              },
              localsConvention: 'dashesOnly',
              sourceMap: true
            }
          },
          {
            loader: 'sass-loader',
            options: {
              prependData: `
              @import 'src/styles/variables/_variables.scss';`,
              sourceMap: true
            }
          }
        ]
      }
    ]
  }
});
