var webpack = require('webpack');

//noinspection JSUnresolvedVariable,JSUnresolvedFunction
module.exports = {
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
	plugins: [
		new webpack.optimize.UglifyJsPlugin({
			minimize: true,
			sourceMap: false,
			output: {
				comments: false
			},
			compress: {
				warnings: false
			}
		}),
		new webpack.DefinePlugin({
			"process.env": {
				NODE_ENV: JSON.stringify("production")
			}
		})
	]
};
