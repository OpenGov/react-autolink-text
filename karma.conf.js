module.exports = function(config) {
  config.set({
    browsers: [process.env.CONTINUOUS_INTEGRATION ? 'Firefox' : 'Chrome'],
    singleRun: process.env.CONTINUOUS_INTEGRATION === 'true',

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
