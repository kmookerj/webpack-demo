const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const merge = require('webpack-merge');
const validate = require('webpack-validator');
const parts = require('./libs/parts');




const PATHS = {
  app: path.join(__dirname, 'app'),
  style: [
    path.join(__dirname, 'node_modules', 'purecss'),
    path.join(__dirname, 'app', 'main.css')
  ],
  build: path.join(__dirname, 'build'),
  images: path.join(__dirname, 'app', 'images')
};


const common = {

  // Entry accepts a path or an object of entries.
  // We'll be using the latter form given it's
  // convenient with more complex configurations.
  entry: {
    app: PATHS.app,    
    style: PATHS.style
  },
  output: {
    path: PATHS.build,
    filename: '[name].[hash].js',
    // This is used for require.ensure. The setup
    // will work without but this is useful to set.
    chunkFilename: '[hash].js'
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Webpack demo'
    })
  ]
};


var config;

// Detect how npm is run and branch based on that
switch(process.env.npm_lifecycle_event) {
  case 'build':  
  case 'stats':

    config = merge(
      common,       
      parts.extractCSS(PATHS.style),
      parts.purifyCSS([PATHS.app]),
      
      {
       devtool: 'source-map'
      },
      parts.setFreeVariable(
        'process.env.NODE_ENV',
        'production'
      ),
      parts.extractBundle({
        name: 'vendor',
        entries: ['react']
      }),
      parts.minify(),
      parts.clean(PATHS.build),
      parts.extractImage([PATHS.images])

      );
    break;
  default:
    config = merge(
      common,
      parts.devServer({
        // Customize host/port here if needed
        host: process.env.HOST,        
        port: process.env.PORT
      }),
      parts.setupCSS(PATHS.style),
      {
        devtool: 'source-map'
      }
    );
}

console.log(path+", "+__dirname);

module.exports = validate(config, {quiet:true});