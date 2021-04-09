/* eslint-disable */
// @ts-nocheck

const webpack = require('webpack')
const CopyPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin')
const Global = require('glob')
const Path = require('path')

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
					from: 'node_modules/@3mo/model/www/',
					to: ''
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

module.exports = (environment, config, plugins = []) => {
	sharedConfigs.plugins.push(...plugins,
		new webpack.DefinePlugin({
			environment: JSON.stringify(environment)
		})
	)
	const MoDeLConfig = environment !== 'production'
		? { ...sharedConfigs, ...developmentConfigs }
		: { ...sharedConfigs, ...productionConfigs }

	if (environment === 'test') {
		config.entry = [config.entry, ...Global.sync('./**/*.test.ts').filter(path => path.includes('node_modules') === false)]
		config.devtool = false
	}

	return Object.assign(MoDeLConfig, config)
}