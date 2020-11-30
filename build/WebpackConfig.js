/* eslint-disable */
const CopyPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');

const getSharedConfigs = (inDevEnv) => ({
	module: {
		rules: [
			{
				test: /\.ts?$/,
				loader: 'ts-loader',
				options: { allowTsInNodeModules: true }
			}
		]
	},
	plugins: [
		new HtmlWebpackPlugin(),
		new CopyPlugin({
			patterns: [
				{
					from: 'node_modules/@3mo/model-core/www/',
					to: '',
					noErrorOnMissing: true,
					globOptions: {
						ignore: inDevEnv ? ['**/ServiceWorker.js'] : []
					},
				},
				{
					from: 'node_modules/@3mo/model/www/',
					to: '',
					noErrorOnMissing: true,
					globOptions: {
						ignore: inDevEnv ? ['**/ServiceWorker.js'] : []
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
	resolve: {
		extensions: ['.ts', '.js'],
		plugins: [
			new TsconfigPathsPlugin({ configFile: './tsconfig.json' })
		]
	}
})

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
	const sharedConfigs = getSharedConfigs(isDevelopmentEnvironment)
	const MoDeLConfig = isDevelopmentEnvironment
		? { ...sharedConfigs, ...developmentConfigs }
		: { ...sharedConfigs, ...productionConfigs }
	return Object.assign(MoDeLConfig, config)
}