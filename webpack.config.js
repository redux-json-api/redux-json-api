module.exports = {
  entry: './src/jsonapi.js',
  output: {
    path: `${__dirname}/build`,
    filename: 'jsonapi.js'
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel',
        query: {
          presets: ['es2015']
        }
      }
    ]
  }
};
