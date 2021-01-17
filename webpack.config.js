// source: https://webpack.js.org/configuration/
const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const ROOT_PATH = path.resolve(__dirname);
const ENTRY_PATH = path.resolve(ROOT_PATH, 'src/js/main.js');
const SRC_PATH = path.resolve(ROOT_PATH, 'src');
const JS_PATH = path.resolve(ROOT_PATH, 'src/js');
const TEMPLATE_PATH = path.resolve(ROOT_PATH, 'src/index.html');
const SHADER_PATH = path.resolve(ROOT_PATH, 'src/shaders');
const BUILD_PATH = path.resolve(ROOT_PATH, 'dist');

const debug = process.env.NODE_ENV !== 'production';

module.exports = {
  entry: ENTRY_PATH,
  output: {
    path: BUILD_PATH,
    filename: 'bundle.js',
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'WebGL Project Boilerplate',
      template: TEMPLATE_PATH
    }),
    new webpack.DefinePlugin({
      __DEV__: debug
    })
  ],
  resolve: {
    alias: {
      shaders: SHADER_PATH,
    }
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        include: JS_PATH,
        exclude: /(node_modules|bower_components)/,
        use: ['babel-loader', 'eslint-loader']
      },
      {
        test: /\.glsl$/,
        include: SHADER_PATH,
        loader: 'webpack-glsl-loader'
      }
    ]
  },
  devtool: debug ? 'source-map' : 'source-map'
};
