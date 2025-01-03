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
    filename: 'bundle.js',
    path: path.join(__dirname, buildPath)
    //path: path.join(__dirname, 'dist')        
  },
  devServer: {
    //contentBase: path.join(__dirname, 'dist'),
    host: '0.0.0.0', //Change to localhost for development
    port: 3000,    
    allowedHosts: [
      '.orbscape.io',
      '.orbscape.net',
      '.charliephelps.net'     
    ],
    headers: {
      'Access-Control-Allow-Origin': '*' // Optional: Allow cross-origin requests
    },
    historyApiFallback: true, // Handle single-page app routes
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
      }//,
      //{
      //  test: /\.css$/, // Add this rule to handle CSS files
      //  use: ['style-loader', 'css-loader']
      //}
    ]
  },
  resolve: {
    extensions: ['.ts','.js']
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',      
      template: 'src/html/index.html'
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development')
    })    
  ]
  
}
