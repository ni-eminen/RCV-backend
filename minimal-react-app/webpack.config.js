const HtmlWebpackPlugin = require("html-webpack-plugin");
const webpack = require("webpack");
var CompressionPlugin = require("compression-webpack-plugin");

module.exports = {
  optimization: {
    minimize: true, //Update this to true or false
  },
  entry: "./src/index.js",
  output: {
    filename: "./app.js",
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: "babel-loader",
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({ template: "src/index.html" }),
    new webpack.DefinePlugin({
      // <-- key to reducing React's size
      "process.env": {
        NODE_ENV: JSON.stringify("production"),
      },
    }),
    new webpack.optimize.AggressiveMergingPlugin(), //Merge chunks
  ],
  devServer: {
    host: "0.0.0.0",
    historyApiFallback: true,
  },
  mode: "none",
};
