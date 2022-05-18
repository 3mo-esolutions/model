/* eslint-disable */
const path = require('path')
const MoDeLWebpackConfigFactory = require('./node_modules/@3mo/model/build/WebpackConfig.ts')
const CopyPlugin = require('copy-webpack-plugin')
const FaviconsWebpackPlugin = require('favicons-webpack-plugin')

module.exports = (_, arguments) => MoDeLWebpackConfigFactory(arguments.env.test ? 'test' : arguments.mode, {
	entry: './application/index.ts',
	context: path.resolve(__dirname),
	output: {
		filename: 'main.js',
		path: path.resolve(__dirname, 'dist'),
		publicPath: '/'
	},
	devServer: {
		static: path.join(__dirname, 'dist'),
		historyApiFallback: true
	}
}, [
	new CopyPlugin({
		patterns: [
			{
				from: 'assets/3mo.svg',
				to: 'assets/3mo.svg'
			}
		]
	}),
	new FaviconsWebpackPlugin({
		logo: './assets/logo.svg',
		manifest: './assets/manifest.json'
	}),
])