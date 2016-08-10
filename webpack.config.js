// var debug = process.env.NODE_ENV !== "production";
// var webpack = require('webpack');

// module.exports = {
//   // context: __dirname + "/src",
//   devtool: debug ? "inline-sourcemap" : null,
//   entry: [__dirname + "/src/app.js"],
//   output: {
//     path: __dirname,
//     filename: "bundle.js",
//   },
//   module: {
//     loaders: [
//       {
//         test: /\.jsx?$/,
//         loader: 'babel-loader',
//         exclude:
//         query: {
//           presets: ["es2015"],
//         },
//       },
//     ],
//   },
//   resolve: {
//     modulesDirectories: ["node_modules"],
//     extensions: ["", ".js", ".jsx"],
//   },
//   plugins: debug ? [] : [
//     new webpack.optimize.DedupePlugin(),
//     new webpack.optimize.OccurenceOrderPlugin(),
//     new webpack.optimize.UglifyJsPlugin({ mangle: false, sourcemap: false }),
//   ],
// };
var debug = process.env.NODE_ENV !== "production";
var webpack = require('webpack');

module.exports = {
  context: __dirname + "/src",
  devtool: debug ? "inline-sourcemap" : null,
  entry: [__dirname + "/src/app.js"],
  resolve: {
    modulesDirectories: ['node_modules', 'components'],
    extensions: ['', '.js', '.jsx']
  },
  output: {
    path: __dirname,
    filename: "bundle.js"
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: {
          presets: ["es2015"]
        }
      }
    ]
  },
  plugins: debug ? [] : [
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.optimize.UglifyJsPlugin({ mangle: false, sourcemap: false }),
  ],
};
