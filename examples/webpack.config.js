module.exports = {
  entry: './examples/app',

  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel'
      }
    ]
  },

  resolve: {
    alias: {
      'react-autolink-text': '../src/index'
    }
  }
};
