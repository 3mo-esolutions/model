/* eslint-disable */
// @ts-nocheck
const path = require('path')
const MoDeLWebpackConfigFactory = require('./build/WebpackConfig.ts')

const config = MoDeLWebpackConfigFactory('test', {
	entry: './test/TestApplication.ts',
	mode: 'development',
	context: path.resolve(__dirname),
	output: {
		filename: 'main.js',
		path: path.resolve(__dirname, 'test-temp'),
		publicPath: '/'
	}
})

config.entry = config.entry.filter(entry => entry.includes('/samples/') === false)

module.exports = () => config