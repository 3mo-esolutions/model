export const nonInertable = () => (constructor: Constructor<HTMLElement>) => {
	Object.defineProperty(constructor.prototype, 'inert', {
		enumerable: true,
		configurable: false,
		get: () => false,
		set: (value) => value
	})
}