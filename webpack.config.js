const path = require('path')
const PrettierPlugin = require("prettier-webpack-plugin")

module.exports = {
	mode: 'development',
	entry: path.resolve(__dirname, 'src', 'index.tsx'),
	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: 'bundle.js'
	},
	resolve: {
		extensions: ['.tsx', '.ts', '.js']
	},
	devServer: {
		contentBase: path.resolve(__dirname, 'dist'),
		open: true,
		clientLogLevel: 'silent',
		port: 9000,
		hot: true
	},
	module: {
		rules: [
			{
				test: /\.(ts|tsx)$/,
				include: path.resolve(__dirname, 'src'),
				exclude: /node_modules/,
				use: [
					{
						loader: 'ts-loader'
					}
				]
			}
		]
	},
	plugins: [
		new PrettierPlugin()
	],
	devtool: 'source-map'
}
