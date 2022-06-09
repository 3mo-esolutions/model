/* eslint-disable */
const path = require('path')
const MoDeLWebpackConfigFactory = require('./node_modules/@3mo/model/build/WebpackConfig.ts')
const FaviconsWebpackPlugin = require('favicons-webpack-plugin')

module.exports = (_, arguments) => MoDeLWebpackConfigFactory(arguments.env.test ? 'test' : arguments.mode, {
	entry: './application/index.ts',
	context: path.resolve(__dirname),
	output: {
		filename: 'main.js',
		path: path.resolve(__dirname, arguments.env.test ? 'test-temp' : 'dist'),
		publicPath: '/'
	},
	devServer: {

		historyApiFallback: true,
		port: 3000,
	}
}, [
	new FaviconsWebpackPlugin({
		logo: './assets/logo.svg',
		manifest: './assets/manifest.json'
	}),
])