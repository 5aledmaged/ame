import path from 'path';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import webpack from 'webpack';

export default {
	devtool: 'inline-source-map',
	entry: {
		vendor: path.resolve(__dirname, 'src', 'js', 'vendor.js'),
		main: path.resolve(__dirname, 'src', 'js', 'app.js')
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
		}),
		new webpack.ProvidePlugin({
			'$': 'jquery'
		})
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
				use: [
					{ loader: 'style-loader' },
					{
						loader: "css-loader",
						options: { url: false }
					},
					{ loader: 'less-loader' }
				]
			}
		]
	}
}