const Webpack = require('webpack');
const merge = require('webpack-merge');
const TerserPlugin = require('terser-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const common = require('./webpack.common.js');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const { ENDPOINTS } = require('./cliargs');
const SETTINGS = require("../configs/settings");

module.exports = merge(common, {
  mode: 'production',
  devtool: false,
  stats: 'normal',
  bail: true,
  output: {
    filename: '[name].[contenthash:5].js',
    chunkFilename: '[name].[contenthash:5].js'
  },

  optimization: {
    runtimeChunk: false,
    splitChunks: {
      cacheGroups: {
        default: false
      }
    },
    minimizer: [
      new TerserPlugin({
        cache: true,
        parallel: true,
        sourceMap: false, // set to true if you want JS source maps
        terserOptions: {
          compress: {
            drop_console: true
          }
        }
      }),
      new OptimizeCSSAssetsPlugin({})
    ]
  },
  plugins: [
    // new BundleAnalyzerPlugin(),
    new Webpack.DefinePlugin({
      NODE_ENV: JSON.stringify('production'),
      APP_ENV: ENDPOINTS,
      SETTINGS:SETTINGS
    }),
    new Webpack.optimize.ModuleConcatenationPlugin(),
    new MiniCssExtractPlugin({
      filename: 'style.[contenthash:5].min.css'
    })
  ],
  module: {
    rules: [
      {
        test: /\.s?css/i,
        use: [
          MiniCssExtractPlugin.loader,
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
                localIdentName: '[hash:base64:5]'
              },
              localsConvention: 'dashesOnly',
              sourceMap: false
            }
          },
          {
            loader: 'sass-loader',
            options: {
              prependData: `
              @import 'src/styles/variables/_variables.scss';`,
              sourceMap: false
            }
          }
        ]
      }
    ]
  }
});
