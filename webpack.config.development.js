const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const npm_package = require('./package.json')

const OUTPUT_PATH = path.resolve(__dirname, 'dist');

const moduleAlias = npm_package._moduleAliases;
for(const key in moduleAlias) {
  moduleAlias[key] = path.resolve(__dirname, moduleAlias[key]);
}

module.exports = {
  mode: "development",

  // Enable sourcemaps for debugging webpack's output.
  devtool: "source-map",

  devServer: {
    contentBase: './dist',
  },

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
              cacheDirectory: true,
            }
          },
          // { loader: "ts-loader" },
        ]
      },
      // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
      {
          enforce: "pre",
          test: /\.js$/,
          loader: "source-map-loader",
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader',
        ],
      },
      {
        test: /\.s[ac]ss$/i,
        use: [
          // Creates `style` nodes from JS strings
          'style-loader',
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
          name: 'assets/files/[name].[ext]',
        }
      },
      {
        test: /\.(ttf|eot|svg|woff(2)?)(\?.*)?$/,
        loader: 'file-loader',
        options: {
          name: 'assets/files/[name].[ext]',
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
    filename: '[name].bundle.js',
    path: OUTPUT_PATH,
  },

  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': `"development"`
    }),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'src', 'index.html'),
    }),
  ],
};