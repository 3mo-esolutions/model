/* eslint-disable */
import { resolve } from 'path'
import MoDeLWebpackConfigFactory from '@3mo/model/packages/webpack-config/WebpackConfigFactory.mjs'

export default (_, args) => MoDeLWebpackConfigFactory(args.env.test ? 'test' : args.mode, {
	entry: './application/index.ts',
	output: {
		filename: 'main.js',
		path: resolve(args.env.test ? 'test-temp' : 'dist'),
		publicPath: '/'
	},
	devServer: {
		historyApiFallback: true
	}
})