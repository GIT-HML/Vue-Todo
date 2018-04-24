const path = require('path')
const HTMLPlugin = require('html-webpack-plugin')
const webpack = require('webpack')
const merge = require('webpack-merge')
const UglifyJsPlugin = require("uglifyjs-webpack-plugin") // 貌似 webpack4 已经取消
const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin")
const baseConfig = require('./webpack.config.base')

const isDev = process.env.NODE_ENV === 'development'

const defaultPlugins = [
  new webpack.DefinePlugin({
    'process.env': {
      NODE_ENV: isDev ? '"development"' : '"production"'
    }
  }),
  new HTMLPlugin()
]

const devServer = {
  port: 8080,
  host: '0.0.0.0',
  overlay: {
    errors: true
  },
  hot: true
}

let config

if (isDev) {
  config = merge(baseConfig, {
    devtool: '#cheap-module-eval-sourve-map',
    module: {
      rules: [
        {
          test: /\.css$/,
          use: [
            'vue-style-loader',
            'css-loader'
          ]
        },
        {
          test: /\.styl$/,
          use: [
            'vue-style-loader',
            'css-loader',
            {
              loader: 'postcss-loader',
              options: {
                sourceMap: true
              }
            },
            'stylus-loader'
          ]
        },
        {
          test: /\.s?[ac]ss$/,
          use: [
            'vue-style-loader',
            'css-loader',
            {
              loader: 'postcss-loader',
              options: {
                sourceMap: true
              }
            },
            'sass-loader'
          ]
        }
      ]
    },
    devServer,
    plugins: defaultPlugins.concat([
      new webpack.HotModuleReplacementPlugin(),
      new webpack.NoEmitOnErrorsPlugin(),
      new MiniCssExtractPlugin({
        // Options similar to the same options in webpackOptions.output
        // both options are optional
        filename: "[name].css",
        chunkFilename: "[id].css"
      })
    ])
  })
} else {
  config = merge(baseConfig, {
    entry: {
      app: path.join(__dirname, '../src/index.js'),
      vendor: ['vue']
    },
    output: {
      filename: '[name].[chunkhash:8].js'
    },
    module: {
      rules: [
        {
          test: /\.css$/,
          use: [
            MiniCssExtractPlugin.loader,  // replace ExtractTextPlugin.extract({..})
            "css-loader"
          ]
        },
        {
          test: /\.styl$/,
          use: [
            MiniCssExtractPlugin.loader,
            'css-loader',
            {
              loader: 'postcss-loader',
              options: {
                sourceMap: true
              }
            },
            'stylus-loader'
          ]
        },
        {
          test: /\.(sass|scss)$/,
          use: [
            MiniCssExtractPlugin.loader,
            'css-loader',
            {
              loader: 'postcss-loader',
              options: {
                sourceMap: true
              }
            },
            'sass-loader'
          ]
        }
      ]
    },
    optimization: {
      // minimizer: [
      //   new UglifyJsPlugin({
      //     cache: true,
      //     // paraller: true, // 未知问题，会报错
      //     sourceMap: true
      //   }),
      //   new OptimizeCSSAssetsPlugin()
      // ],
      splitChunks: {
        cacheGroups: {              // 这里开始设置缓存的 chunks
          commons: {
            chunks: 'initial',      // 必须三选一： "initial" | "all" | "async"(默认就是异步)
            minSize: 0,             // 最小尺寸，默认0,
            minChunks: 2,           // 最小 chunk ，默认1
            maxInitialRequests: 5   // 最大初始化请求书，默认1
          },
          vendor: {
            test: /node_modules/,   // 正则规则验证，如果符合就提取 chunk
            chunks: 'initial',      // 必须三选一： "initial" | "all" | "async"(默认就是异步)
            name: 'vendor',         // 要缓存的 分隔出来的 chunk 名称
            priority: 10,           // 缓存组优先级
            enforce: true
          }
        }
      },
      runtimeChunk: true
    },
    plugins: defaultPlugins.concat([
      new MiniCssExtractPlugin({
        filename: 'css/app.[name].[contenthash:8].css',
        chunkFilename: 'css/app.[contenthash:8].css'  // use contenthash *
      })
    ])
  })
}

module.exports = config
