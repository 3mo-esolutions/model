/* eslint-disable */
const process = require('process')
process.env.EDGE_BIN = require('puppeteer').executablePath()

const karmaConfig = {
	basePath: '.',
	frameworks: ['jasmine'],
	plugins: [
		'@chiragrupani/karma-chromium-edge-launcher',
		'karma-jasmine',
		'karma-spec-reporter'
	],
	files: [
		'./dist/bundle.js'
	],
	exclude: [],
	preprocessors: {},
	reporters: ['spec'],
	port: 9876,
	browsers: ['EdgeHeadlessCustom'],
	customLaunchers: {
		EdgeHeadlessCustom: {
			base: 'EdgeHeadless',
			flags: ['--no-sandbox', '--disable-gpu']
		}
	},
	colors: true,
	autoWatch: false,
	singleRun: true,
	concurrency: Infinity,
	crossOriginAttribute: false,
	specReporter: {
		maxLogLines: 15,
		suppressErrorSummary: true,
		suppressFailed: false,
		suppressPassed: false,
		suppressSkipped: true,
		showSpecTiming: false,
	},
}

module.exports = karmaConfig