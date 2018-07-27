const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");

const config = { ...require("./webpack.config") };
config.mode = "production";
config.plugins = [...(config.plugins || []), new BundleAnalyzerPlugin()];

module.exports = config;
