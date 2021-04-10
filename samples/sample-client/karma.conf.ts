/* eslint-disable */
// @ts-nocheck
const karmaConfig = require('@3mo/model/build/KarmaConfig.ts')

module.exports = config => {
	karmaConfig.logLevel = config.LOG_ERROR
	config.set(karmaConfig)
}