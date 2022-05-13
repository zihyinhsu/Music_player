const path = require('path');
const Dotenv = require('dotenv-webpack');

const HtmlWebpackPlugin = require('html-webpack-plugin');
// node 中與路徑的相關套件
module.exports = {
  entry: './src/index.js',
  // 進入點，所以檔案必須與此檔案有關聯才會被編譯
  output: {
    // 編譯檔案的位置
    path: path.resolve(__dirname, 'dist'),
    // 編譯檔案名稱
    filename: 'bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.s[ac]ss$/i,
        use: [
          // Creates `style` nodes from JS strings
          "style-loader",
          // Translates CSS into CommonJS
          "css-loader",
          // Compiles Sass to CSS
          "sass-loader",
        ],
      },
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      }
    ]
  },
  plugins: [
    // 生成html檔案到輸入目錄
    new HtmlWebpackPlugin({
      // 可以以src目錄下的html原始檔為模板
      template: './src/index.html',
      // 在目標目錄下生成目標檔案
      filename: './index.html',
      chunks: ['a', 'b'] // 這個引數配合entry可以將打包的模組以<script></script>的形式載入到html檔案中
    }),
    new Dotenv()
  ],
  devServer: {
    static: {
      directory: path.join(__dirname, 'dist'),
    },
    compress: true,
    port: 3000,
    open:true
  }
};