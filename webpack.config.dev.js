import path from 'path';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import webpack from 'webpack';

export default {
	devtool: 'inline-source-map',
	entry: {
		app: path.resolve(__dirname, 'src', 'js', 'app.js')
	},
	target: 'web',
	output: {
		path: path.resolve(__dirname, 'src'),
		publicPath: '/',
		filename: '[name].js'
	},
	plugins: [
		// Create HTML file that includes reference to bundled JS.
		new HtmlWebpackPlugin({
			template: 'src/index.html',
			inject: true
		})
	],
	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				use: [
					{
						loader: 'babel-loader',
						options: { sourceMap: true }
					},
					{
						loader: 'eslint-loader',
						options: {
							failOnError: true,
							sourceMap: true
						}
					}
				]
			},
			{
				test: /\.less$/,
				use: [
					{
						loader: 'style-loader',
						options: { sourceMaps: true }
					},
					{
						loader: 'css-loader',
						options: {
							url: false,
							importLoaders: 1,
							sourceMap: true
						}
					},
					{
						loader: 'postcss-loader',
						options: {
							sourceMap: true,
							plugins: [
								require('postcss-import')(),
								require('autoprefixer')()
							]
						}
					},
					{
						loader: 'less-loader',
						options: {
							sourceMap: true
						}
					}
				]
			}
		]
	}
}