const path = require('path');
const pkg = require('./package.json');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const buildPath = './build/';

module.exports = {
  entry: {
    main: './src/scripts/entry.ts'    
  },
  output: {
    path: path.join(__dirname, buildPath),
    filename: 'bundle.js'
  },
  devServer: {
    host: '0.0.0.0',
    port: 3169, // Change to a different port  
  },
  mode: 'development',
  target: 'web',
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: path.resolve(__dirname, './node_modules/')
      },
      {
        test: /\.(jpe?g|png|gif|svg|tga|glb|babylon|mtl|pcb|pcd|prwm|obj|mat|mp3|ogg)$/i,
        use: 'file-loader',
        exclude: path.resolve(__dirname, './node_modules/')
      }
    ]
  },
  resolve: {
    extensions: ['.ts','.js']
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',      
      template: 'src/html/index.html'
    })

    
  ]
}
