module.exports = {
    context: __dirname + '/src',
    entry: {
    javascript: "./index.js",
    html: "./index.html",
  },

  output: {
    filename: "index.js",
    path: __dirname + "/dist",
  },

  devServer: {
    proxy: {
      '/': {
        target: 'localhost:3000',
        secure: false
      }
    }
  },

  module: {
    loaders: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      }, {
        test: /\.html$/,
        loader: "file?name=[name].[ext]",
      }, {
        test: /\.(css|scss)$/,
        loaders: [
          "style",
          "css-loader?modules=true&localIdentName=[name]__[local]___[hash:base64:5]",
          "sass"
        ],
      },
    ]
  }
}
