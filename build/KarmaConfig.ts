/* eslint-disable */
module.exports = {
	basePath: '.',
	frameworks: ['parallel', 'jasmine'],
	plugins: ['karma-*'],
	files: ['./test-temp/main.js'],
	reporters: ['helpful'],
	logLevel: 'ERROR',
	port: 9876,
	browsers: ['ChromeHeadless'],
	colors: true,
	autoWatch: true,
	singleRun: false,
	concurrency: Infinity,
	crossOriginAttribute: false,
	parallelOptions: {
		executors: 4,
	},
	helpfulReporter: {
		removeTail: true,
		colorBrowser: 205,
		colorConsoleLogs: 45,
		colorPass: 10,
		colorSkip: 11,
		colorFail: 9,
		colorTestName: 250,
		colorFirstLine: 9,
		colorLoggedErrors: 9,
	}
}