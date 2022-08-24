/* eslint-disable @typescript-eslint/no-unused-vars */

Object.defineProperty(Event.prototype, 'source', {
	get(this: Event) { return this.target },
	configurable: false,
})

interface CustomEvent<T, TElement extends Element = Element> extends Event {
	readonly detail: T
	readonly source: TElement
}