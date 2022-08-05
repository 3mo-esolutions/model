/* eslint-disable @typescript-eslint/no-unused-vars */

Object.defineProperty(Event.prototype, 'source', {
	get(this: Event) { return this.target },
	configurable: false,
})

Object.defineProperty(HTMLElement.prototype, 'eventHandlers', {
	get: function () { return this.__eventHandlers ??= [] },
	enumerable: true,
	configurable: false
})

const addEventListenerBase = HTMLElement.prototype.addEventListener
HTMLElement.prototype.addEventListener = function (type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions) {
	this.eventHandlers.push({ name: type, eventListener: listener })
	addEventListenerBase.call(this, type, listener, options)
}

const removeEventListenerBase = HTMLElement.prototype.removeEventListener
HTMLElement.prototype.removeEventListener = function (type: string, listener: EventListenerOrEventListenerObject, options?: boolean | EventListenerOptions) {
	this.eventHandlers.forEach(({ eventListener, name }, i) => {
		if (name === type && eventListener === listener) {
			delete this.eventHandlers[i]
		}
	})
	removeEventListenerBase.call(this, type, listener, options)
}

interface CustomEvent<T, TElement extends Element = Element> extends Event {
	readonly detail: T
	readonly source: TElement
}

interface HTMLElement {
	readonly eventHandlers: Array<{ readonly name: string, readonly eventListener: EventListenerOrEventListenerObject }>
}