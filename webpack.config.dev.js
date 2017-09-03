import path from 'path';

export default {
	devtool: 'inline-source-map',
	entry: path.resolve(__dirname, 'src', 'js', 'app.js'),
	target: 'web',
	output: {
		path: path.resolve(__dirname, 'src'),
		publicPath: '/js/',
		filename: 'bundle.js'
	},
	plugins: [],
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