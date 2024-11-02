const path = require('path');
const pkg = require('./package.json');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');

module.exports = {
  entry: {
    main: './src/scripts/entry.ts'    
  },
  output: {
    filename: 'bundle.js',
    path: path.join(__dirname, 'dist')    
  },
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    host: '0.0.0.0',
    port: 3000,
    publicPath: '/'
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
