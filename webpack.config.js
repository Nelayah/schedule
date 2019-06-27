"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const {CleanWebpackPlugin} = require("clean-webpack-plugin");
const TerserJSPlugin = require('terser-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const pkg = require(path.join(process.cwd(), 'package.json'));
const { NODE_ENV } = process.env;
const CWD = process.cwd();

exports.default = ({
	mode: NODE_ENV,
	entry: './src/style/index.tsx',
	externals: {
		react: {
			root: 'React',
			commonjs2: 'react',
			commonjs: 'react',
			amd: 'react'
		},
		'react-dom': {
			root: 'ReactDOM',
			commonjs2: 'react-dom',
			commonjs: 'react-dom',
			amd: 'react-dom'
		},
		typescript: 'typescript'
	},
	context: CWD,
	output: {
		filename: 'index.js',
		path: path.join(CWD, 'lib/style'),
		libraryTarget: "umd",
		library: pkg.name
	},
	resolve: {
		extensions: ['.js', '.ts', '.tsx']
	},
	module: {
		rules: [
			{
				test: /\.tsx?$/,
				use: [
					{
            loader: 'babel-loader',
            options: {
              presets: [
                ['@babel/preset-env', {modules: false}],
                '@babel/preset-react'
              ],
              plugins: [
                ['@babel/plugin-transform-runtime']
              ]
            }
          },
					{
            loader: 'ts-loader',
            options: { transpileOnly: true }
          }
				]
			},
			{
        test: /\.less$/,
        exclude: /node_modules/,
				use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'less-loader',
          'postcss-loader',
          'less-loader'
        ]
      },
			{
				test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader'
        ]
      },
		]
	},
	performance: {
		hints: false
  },
  optimization: {
    minimizer: [
      new TerserJSPlugin({}),
      new OptimizeCSSAssetsPlugin({})
    ],
  },
	stats: {
		modules: false,
		moduleTrace: false,
		children: false
	},
	plugins: [
		new CleanWebpackPlugin({
			verbose: true,
      dry: false,
      // cleanOnceBeforeBuildPatterns: ['lib/style/index.js']
      cleanAfterEveryBuildPatterns: ['lib/style/index.js']
		}),
		new MiniCssExtractPlugin({
      filename: 'index.css',
      allChunks: true
    })
	]
});
