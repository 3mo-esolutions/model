/* eslint-disable */
const webpack = require('webpack')
const CopyPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin')

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
	plugins: [
		new HtmlWebpackPlugin(),
		new CopyPlugin({
			patterns: [
				{
					from: 'node_modules/@3mo/model-core/www/',
					to: ''
				},
				{
					from: 'manifest.json',
					to: 'manifest.json'
				}
			]
		})
	],
	resolve: {
		extensions: ['.ts', '.js'],
		plugins: [
			new TsconfigPathsPlugin({ configFile: './tsconfig.json' })
		]
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

module.exports = (config, isDevelopmentEnvironment = false, plugins = []) => {
	sharedConfigs.plugins.push(...plugins, new webpack.DefinePlugin({
		environment: JSON.stringify(isDevelopmentEnvironment ? 'development' : 'production')
	}))
	const MoDeLConfig = isDevelopmentEnvironment
		? { ...sharedConfigs, ...developmentConfigs }
		: { ...sharedConfigs, ...productionConfigs }
	return Object.assign(MoDeLConfig, config)
}