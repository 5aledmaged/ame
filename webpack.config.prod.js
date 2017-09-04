import path from 'path';
import webpack from 'webpack';

export default {
	devtool: 'source-map',
	entry: path.resolve(__dirname, 'src', 'js', 'app.js'),
	target: 'web',
	output: {
		path: path.resolve(__dirname, 'dist'),
		publicPath: '/js/',
		filename: 'bundle.js'
	},
	plugins: [
		// Eliminate duplicate packages when generating bundle
		new webpack.optimize.DedupePlugin(),
		// Minify JS
		new webpack.optimize.UglifyJsPlugin()
	],
	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				use: ['babel-loader', 'eslint-loader']
			},
			{
				test: /\.less$/,
				use: [ 'style-loader', 'css-loader', 'less-loader' ]
			},
			{
				test: /\.(png|jpg|gif|svg|eot|ttf|woff|woff2)$/,
				loader: 'file-loader'
			}
		]
	}
}