const webpack = require('webpack');
const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const npm_package = require('./package.json')

const OUTPUT_PATH = path.resolve(__dirname, 'build');

const moduleAlias = npm_package._moduleAliases;
for(const key in moduleAlias) {
  moduleAlias[key] = path.resolve(__dirname, moduleAlias[key]);
}

module.exports = {
  mode: "production",

  entry: './src/index.tsx',

  resolve: {
    extensions: [".wasm", ".ts", ".tsx", ".mjs", ".cjs", ".js", ".json"],
    alias: moduleAlias || {},
    modules: npm_package._moduleDirectories || ["node_modules"],
  },

  module: {
    rules: [
      {
        test: /\.ts(x?)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: "babel-loader",
            options: {
              cacheDirectory: true
            }
          },
          // { loader: "ts-loader" }
        ]
      },
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
        ],
      },
      {
        test: /\.s[ac]ss$/i,
        use: [
          MiniCssExtractPlugin.loader,
          // Translates CSS into CommonJS
          'css-loader',
          // Compiles Sass to CSS
          'sass-loader',
        ],
      },
      {
        test: /\.(png|jpg|jpeg|gif)$/i,
        loader: 'url-loader',
        options: {
          // files larger than 4KB will use file-loader
          limit: 4096,
          fallback: 'file-loader',
          name: 'assets/files/[hash].[ext]',
        }
      },
      {
        test: /\.(ttf|eot|svg|woff(2)?)(\?.*)?$/,
        loader: 'file-loader',
        options: {
          name: 'assets/files/[hash].[ext]',
        }
      }
    ]
  },

  // When importing a module whose path matches one of the following, just
  // assume a corresponding global variable exists and use that instead.
  // This is important because it allows us to avoid bundling all of our
  // dependencies, which allows browsers to cache those libraries between builds.
  externals: {
    // "react": "React",
    // "react-dom": "ReactDOM"
  },

  output: {
    filename: '[name].[contenthash].bundle.js',
    path: OUTPUT_PATH,
    hashDigestLength: 8,
  },

  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': `"production"`
    }),
    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      filename: 'assets/style/[name].[contenthash].css',
      chunkFilename: 'assets/style/[id].[chunkHash].css',
    }),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'src', 'index.html'),
    })
  ],

  optimization: {
    splitChunks: {
      chunks: "all",
      cacheGroups: {
        // 抽离不同entry共用代码
        commons: {
          chunks: "initial",
          // 至少2个chunks共用的
          minChunks: 2,
          name: "commons",
          maxInitialRequests: 5,
          minSize: 0,
          filename: 'common.[chunkHash].js',
        },
        // 抽离react相关代码
        reactBase: {
          test: (module) => {
            return /react|redux|prop-types/.test(module.context);
          },
          chunks: "initial",
          name: "reactBase",
          priority: 10, // 优先级配置项
          filename: 'reactBase.[chunkHash].js',
        },
        // 抽离node_modules
        vendors: {
          test: /[\\/]node_modules[\\/]/, // 匹配node_modules目录下的文件
          priority: -10, // 优先级配置项
          filename: 'vendor.[chunkHash].js',
        },
      }
    },
  }
};