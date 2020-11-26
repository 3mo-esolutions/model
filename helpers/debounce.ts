// eslint-disable-next-line @typescript-eslint/ban-types
type DebounceInterval = 250 | 500 | 750 | (number & {})

export default function debounce(timeout: DebounceInterval = 250) {
	let timerId: number
	return function (_context: any, _propertyKey: string, descriptor: PropertyDescriptor) {
		const original = descriptor.value
		descriptor.value = function (...args: any[]) {
			if (MDC.environment === 'test') {
				original.apply(this, args)
				return
			}

			window.clearTimeout(timerId)
			timerId = window.setTimeout(() => original.apply(this, args), timeout)
		}
		return descriptor
	}
}