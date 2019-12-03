var path = require('path');
var webpack = require('webpack');
var UglifyJsPlugin = require('uglifyjs-webpack-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');

//noinspection JSUnresolvedVariable,JSUnresolvedFunction
module.exports = {
	mode: "production",
	entry: "src/index.tsx",
	output: {
		path: __dirname + '/../public_html/js',
		filename: 'index.js'
	},
	module: {
		rules: [
			{
				test: /\.tsx?$/,
				enforce: 'pre',
				loader: 'tslint-loader',
			},
			{
				test: /\.tsx?$/,
				use: 'ts-loader'
			}
		]
	},
	resolve: {
		// you can now require('file') instead of require('file.tsx')
		extensions: ['.js', '.ts', '.tsx'],
		// resolve modules by webpack, not typescript
		modules: ['node_modules', __dirname]
	},
	stats: {
		modules: false,
		colors: true
	},
	performance: {
		hints: false
	},
	plugins: [
		new webpack.DefinePlugin({
			"process.env": {
				NODE_ENV: JSON.stringify("production")
			}
		}),
		// copy custom static assets
		new CopyWebpackPlugin([
			{
				from: path.join(__dirname, "assets"),
				to: '../assets/',
				ignore: ['.*']
			},
		])
	],
	optimization: {
		minimizer: [
			new UglifyJsPlugin({
				sourceMap: false,
				uglifyOptions: {
					output: {
						comments: false
					},
					warnings: false
				}
			})
		]
	}
};
