const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const SpeedMeasurePlugin = require("speed-measure-webpack-plugin");

module.exports = new SpeedMeasurePlugin().wrap({
  devtool: "source-map",
  entry: "./src/index",
  mode: process.env.NODE_ENV || "production",
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: {
          loader: "ts-loader",
          options: {
            transpileOnly: false,
            experimentalWatchApi: true
          }
        },
        exclude: /node_modules/
      },
      {
        test: /\.(gif|jpg|mp3|ogg|png|svg|wav)$/,
        use: ["file-loader"]
      }
    ]
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"]
  },
  output: {
    filename: "js/bundle.js",
    path: path.resolve(__dirname, "dist"),
    pathinfo: false // speeds things up. I don't think we need it
  },
  plugins: [new HtmlWebpackPlugin({ template: "src/index.html" })]
});
