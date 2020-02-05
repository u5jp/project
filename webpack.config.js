module.exports = {
    entry: './src/js/main.js',
    output: {
      filename: './dist/bundle.js'
    },
    module: {
      rules: [
        {
          test: /.js$/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env']
            }
          }
        }
      ]
    }
  }