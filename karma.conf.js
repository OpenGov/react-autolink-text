module.exports = function(config) {
  config.set({
    browsers: ['Chrome'],

    frameworks: ['jasmine'],

    files: [
      'tests.webpack.js'
    ],

    preprocessors: {
      'tests.webpack.js': ['webpack', 'sourcemap']
    },

    reporters: ['dots'],

    webpack: {
      devtool: 'inline-source-map',
      module: {
        loaders: [
          {
            test: /\.js$/,
            exclude: /node_modules/,
            loader: 'babel'
          }
        ]
      }
    },

    webpackServer: {
      noInfo: true
    }
  });
};
