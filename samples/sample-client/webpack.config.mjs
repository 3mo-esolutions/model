import { resolve } from 'path'
import MoDeLWebpackConfigFactory from '@3mo/model/packages/webpack-config/WebpackConfigFactory.mjs'
import FaviconsWebpackPlugin from 'favicons-webpack-plugin'

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
}, [
	new FaviconsWebpackPlugin({
		logo: './assets/logo.svg',
		manifest: './assets/manifest.json'
	}),
])