const Path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { BUILD_FOR_ENV } = require('./cliargs');
const BUILD_DIR = Path.join(__dirname, '../build');
const SRC_DIR = Path.resolve(__dirname, '../src');

module.exports = {
  entry: {
    main: SRC_DIR + '/index.tsx'
  },
  output: {
    path: BUILD_DIR,
    filename: '[name].js'
  },
  optimization: {
    splitChunks: {
      chunks: 'all',
      name: false
    }
  },
  plugins: [
    new CleanWebpackPlugin({ root: BUILD_DIR }),
    new CopyWebpackPlugin({
      patterns: [
        { from: Path.resolve(__dirname, '../public'), to: BUILD_DIR },
        { from: Path.resolve(__dirname, '../src/assets'), to: BUILD_DIR }
      ]
    }),
    new HtmlWebpackPlugin({
      template: Path.resolve(SRC_DIR, 'index.html')
    })
  ],
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.css', '.scss']
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        enforce: 'pre',
        use: [
          { loader: 'babel-loader' },
          { loader: 'ts-loader' },
          {
            loader: 'ifdef-loader',
            options: {
              BUILD_ENV: BUILD_FOR_ENV
            }
          }
        ]
      },
      {
        test: /\.(ico|jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2)(\?.*)?$/,
        use: {
          loader: 'file-loader',
          options: {
            name: '[path][name].[ext]'
          }
        }
      }
    ]
  }
};
