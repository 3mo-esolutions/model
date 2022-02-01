/* eslint-disable @typescript-eslint/no-unused-vars */
JSON.isJson = function (text: string) {
	try {
		JSON.parse(text)
		return true
	} catch (e) {
		return false
	}
}

interface JSON {
	isJson(text: string): boolean
}