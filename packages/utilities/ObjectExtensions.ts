Object.equals = function <T = unknown>(actual: T, expected: T) {
	if (actual === expected) {
		return true
	}

	try {
		actual = JSON.parse(JSON.stringify(actual))
		expected = JSON.parse(JSON.stringify(expected))

		if (actual instanceof Array && expected instanceof Array) {
			const sortedActual = actual.sort()
			const sortedExpected = expected.sort()
			return sortedActual.length === sortedExpected.length
				&& sortedActual.every((value, index) => Object.equals(value, sortedExpected[index]))
		}

		if (actual && typeof actual === 'object' && expected && typeof expected === 'object') {
			const actualKeys = Object.keys(actual).sort() as Array<keyof T>
			const expectedKeys = Object.keys(expected).sort() as Array<keyof T>
			return Object.equals(actualKeys, expectedKeys)
				&& actualKeys.every(key => Object.equals(actual[key], expected[key]))
		}

		return false
	} catch {
		return false
	}
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface ObjectConstructor {
	equals<T = unknown>(actual: T, expected: T): boolean
}