const webpack = require("webpack");
const path = require("path");
const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = function override(config) {
  const fallback = config.resolve.fallback || {};
  Object.assign(fallback, {
    fs: false,
    crypto: require.resolve("crypto-browserify"),
    stream: require.resolve("stream-browserify"),
    assert: require.resolve("assert"),
    http: require.resolve("stream-http"),
    https: require.resolve("https-browserify"),
    os: require.resolve("os-browserify"),
    url: require.resolve("url"),
    "process/browser": require.resolve("process/browser"),
    polyfill: require.resolve("polyfill"),
    zlib: require.resolve("browserify-zlib"),
    path: require.resolve("path-browserify"),
  });
  config.resolve.fallback = fallback;
  config.plugins = (config.plugins || []).concat([
    new webpack.ProvidePlugin({
      process: "process/browser",
      Buffer: ["buffer", "Buffer"],
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: "node_modules/@arcgis/core/assets",
          to: "static/home/js/map/assets",
        },
      ],
    }),
  ]);
  config.module.rules.concat([
    {
      test: /\.(ts|js)x?$/,
      exclude: /node_modules/,
      include: path.resolve(__dirname, "src"),
      use: [
        "cache-loader",
        {
          loader: "babel-loader",
        },
      ],
    },
    {
      test: /\.m?js/,
      type: "javascript/auto",
    },
    {
      test: /\.m?js/,
      resolve: {
        fullySpecified: false,
      },
    },
  ]);

  return config;
};
