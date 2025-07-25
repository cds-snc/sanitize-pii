const path = require('path');

module.exports = {
  entry: './src/index.ts',
  mode: 'production',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  output: {
    filename: 'sanitize-pii.min.js',
    path: path.resolve(__dirname, 'dist/umd'),
    library: {
      name: 'sanitizePii',
      type: 'umd',
      export: 'default',
    },
    globalObject: 'this',
  },
  optimization: {
    minimize: true,
  },
};
