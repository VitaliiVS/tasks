const path = require('path')
const miniCss = require('mini-css-extract-plugin')

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
			},
			{
				test: /\.(s*)css$/,
				use: [
					miniCss.loader,
					'css-loader',
					{
						loader: 'postcss-loader',
						options: {
							sourceMap: true,
							postcssOptions: {
								config: path.resolve(
									__dirname,
									'postcss.config.js'
								)
							}
						}
					},
					'sass-loader'
				]
			}
		]
	},
	plugins: [
		new miniCss({
			filename: 'style.css'
		})
	],
	devtool: 'source-map'
}
