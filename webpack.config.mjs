import { resolve } from 'path'
import MoDeLWebpackConfigFactory from './packages/webpack-config/WebpackConfigFactory.mjs'

const config = MoDeLWebpackConfigFactory('test', {
	entry: './test/TestApplication.ts',
	mode: 'development',
	output: {
		filename: 'main.js',
		path: resolve('test-temp'),
		publicPath: '/'
	}
})

config.entry = config.entry.filter(entry => entry.includes('/samples/') === false)

export default () => config