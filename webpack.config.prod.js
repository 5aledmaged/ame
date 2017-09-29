import path from 'path';
import webpack from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import WebpackSHAHash from 'webpack-sha-hash';
import ExtractTextPlugin from 'extract-text-webpack-plugin';

export default {
	resolve: {
		extensions: ['*', '.js', '.json']
	},
	devtool: 'source-map',
	entry: {
		app: path.resolve(__dirname, 'src', 'js', 'app')
	},
	target: 'web',
	output: {
		path: path.resolve(__dirname, 'dist'),
		publicPath: '/',
		filename: '[name].[chunkhash].js'
	},
	plugins: [
		new webpack.LoaderOptionsPlugin({
			minimize: true,
			debug: false,
			noInfo: true // set to false to see a list of every file being bundled.
		}),
		// Generate an external css file with a hash in the filename
		new ExtractTextPlugin('[name].[contenthash].css'),
		// Hash the files using SHA-256 so that their names change when the content changes.
		new WebpackSHAHash(),
		// Use CommonsChunkPlugin to create a sepreate bundle of vendor libraries
		/* new webpack.optimize.CommonsChunkPlugin({
			name: 'vendor'
		}), */
		// Create HTML file that includes reference to bundled JS.
		new HtmlWebpackPlugin({
			template: 'src/index.html',
			minify: {
				removeComments: true,
				collapseWhitespace: true,
				removeRedundantAttributes: true,
				useShortDoctype: true,
				removeEmptyAttributes: true,
				removeStyleLinkTypeAttributes: true,
				keepClosingSlash: true,
				minifyJS: true,
				minifyCSS: true,
				minifyURLs: true
			},
			inject: true
		}),
		// Minify JS
		new webpack.optimize.UglifyJsPlugin({ sourceMap: true })
	],
	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				use: [
						'babel-loader',
						{
							loader: 'eslint-loader',
							options: {
								failOnError: true
							}
						},
						'strip-loader?strip[]=console.log,strip[]=console.warn,strip[]=console.error'
					]
			},
			{
				test: /\.less$/,
				use: ExtractTextPlugin.extract({
					fallback: 'style-loader',
					use: [
						{
							loader: 'css-loader?sourceMap',
							options: {
								url: false
							}
						},
						'less-loader'
					]
				})
			}
		]
	}
}