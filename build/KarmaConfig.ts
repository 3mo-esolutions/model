/* eslint-disable */
// const process = require('process')
// process.env.EDGE_BIN = require('puppeteer').executablePath()

module.exports = {
	basePath: '.',
	frameworks: ['jasmine'],
	plugins: ['karma-*'],
	files: ['./dist/main.js'],
	exclude: [],
	preprocessors: {},
	reporters: ['spec'],
	port: 9876,
	browsers: ['ChromeHeadless'],
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