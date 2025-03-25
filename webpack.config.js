const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  mode: "development",
  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js",
  },
  devtool: "eval-source-map",
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.(png|jpg|gif)$/,
        use: ["file-loader"],
      },
    ],
  },
  resolve: {
    extensions: [".js"],
  },
  devServer: {
    port: 8001,
    allowedHosts: ["all"],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./index.html",
      inject: "body",
    }),
  ],
};
