/* eslint-disable */
// @ts-nocheck

const webpack = require('webpack')
const CopyPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin')
const FaviconsWebpackPlugin = require('favicons-webpack-plugin')
const Global = require('glob')
const fs = require('fs')

const sharedConfigs = {
	stats: 'minimal',
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
					to: '',
					noErrorOnMissing: true
				}
			]
		}),
		new FaviconsWebpackPlugin({
			logo: 'node_modules/@3mo/model/www/assets/images/3mo.svg',
			manifest: './manifest.json',
			favicons: {
				appleStatusBarStyle: 'default'
			}
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
	const getChangelog = () => {
		try {
			return fs.readFileSync('CHANGELOG.md', 'utf8')
		} catch (error) {
			return undefined
		}
	}

	const define = {
		environment: JSON.stringify(environment),
	}

	const changelog = getChangelog()
	if (changelog) {
		define.changelog = JSON.stringify(changelog)
	}

	sharedConfigs.plugins.push(...plugins, new webpack.DefinePlugin(define))
	const MoDeLConfig = environment !== 'production'
		? { ...sharedConfigs, ...developmentConfigs }
		: { ...sharedConfigs, ...productionConfigs }

	if (environment === 'test') {
		config.entry = [...(config.entry instanceof Array ? config.entry : [config.entry]), ...Global.sync('./**/*.test.ts').filter(path => path.includes('node_modules') === false)]
		config.devtool = false
	}

	return Object.assign(MoDeLConfig, config)
}