/* eslint-disable */
module.exports = {
	basePath: '.',
	frameworks: ['jasmine'],
	plugins: ['karma-*'],
	files: ['./test-temp/main.js'],
	exclude: [],
	preprocessors: {},
	reporters: ['spec'],
	port: 9876,
	browsers: ['ChromeHeadless'],
	colors: true,
	autoWatch: true,
	singleRun: false,
	concurrency: Infinity,
	crossOriginAttribute: false,
	specReporter: {
		maxLogLines: 5,
		suppressErrorSummary: true,
		suppressSkipped: true,
		showSpecTiming: true,
		prefixes: {
			success: '✅ ',
			failure: '❌ ',
			skipped: '⚠ '
		}
	},
}