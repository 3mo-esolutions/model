/* eslint-disable */
const CopyPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')

const sharedConfigs = {
	module: {
		rules: [
			{
				test: /\.ts?$/,
				loader: 'ts-loader',
				options: { allowTsInNodeModules: true }
			}
		]
	},
	resolve: {
		plugins: [
			new HtmlWebpackPlugin(),
			new TsconfigPathsPlugin({ configFile: './tsconfig.json' }),
			new CopyPlugin({
				patterns: [
					{
						from: 'node_modules/@3mo/model_core/www/',
						to: '',
						noErrorOnMissing: true,
						globOptions: {
							ignore: options.isDevelopmentEnvironment ? ['**/ServiceWorker.js'] : []
						},
					},
					{
						from: 'node_modules/@3mo/model/www/',
						to: '',
						noErrorOnMissing: true,
						globOptions: {
							ignore: options.isDevelopmentEnvironment ? ['**/ServiceWorker.js'] : []
						},
					},
					{
						from: 'images/',
						to: 'images/',
						noErrorOnMissing: true
					},
					{
						from: 'release_notes/',
						to: 'release_notes/',
						noErrorOnMissing: true
					},
					{
						from: 'manifest.json',
						to: 'manifest.json',
						noErrorOnMissing: true
					},
					{
						from: 'instance.json',
						to: 'instance.json',
						noErrorOnMissing: true
					},
				]
			})
		],
		extensions: ['.ts', '.js'],
	}

}

const productionConfigs = {
	optimization: {
		minimize: true,
		minimizer: [
			new TerserPlugin({
				terserOptions: {
					output: {
						comments: false,
					},
				},
				extractComments: false,
			})
		],
	}
}

const developmentConfigs = {
	optimization: {
		minimize: false,
		minimizer: undefined
	}
}

module.exports = (config, isDevelopmentEnvironment = false) => {
	const MoDeLConfig = isDevelopmentEnvironment
		? { ...sharedConfigs, ...developmentConfigs }
		: { ...sharedConfigs, ...productionConfigs }
	return Object.assign(MoDeLConfig, config)
}