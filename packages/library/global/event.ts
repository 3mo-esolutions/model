/* eslint-disable @typescript-eslint/no-unused-vars */

type EventHandler<T> = (data: T) => void;

type CustomEventHandler<T> = (event: CustomEvent<T>) => void

Object.defineProperty(Event.prototype, 'source', {
	get(this: Event) { return this.target },
	configurable: false,
})

Object.defineProperty(HTMLElement.prototype, 'eventHandlers', {
	get: function () {
		if (!this.__eventHandlers) {
			this.__eventHandlers = []
		}
		return this.__eventHandlers
	},
	enumerable: true,
	configurable: false
})

HTMLElement.prototype.addEventListenerBase = HTMLElement.prototype.addEventListener
HTMLElement.prototype.addEventListener = function (type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions) {
	this.eventHandlers.push({ name: type, eventListener: listener })
	this.addEventListenerBase(type, listener, options)
}

HTMLElement.prototype.removeEventListenerBase = HTMLElement.prototype.removeEventListener
HTMLElement.prototype.removeEventListener = function (type: string, listener: EventListenerOrEventListenerObject, options?: boolean | EventListenerOptions) {
	this.eventHandlers.forEach(({ eventListener, name }, i) => {
		if (name === type && eventListener === listener) {
			delete this.eventHandlers[i]
		}
	})
	this.removeEventListenerBase(type, listener, options)
}

HTMLElement.prototype.removeAllEventListeners = function () {
	this.eventHandlers.forEach(event => this.removeEventListener(event.name, event.eventListener))
	this.eventHandlers.length = 0
}

interface CustomEvent<T, TElement extends Element = Element> extends Event {
	readonly detail: T
	readonly source: TElement
}

interface HTMLElement {
	readonly eventHandlers: Array<{ readonly name: string, readonly eventListener: EventListenerOrEventListenerObject }>
	addEventListenerBase(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): void
	removeEventListenerBase(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | EventListenerOptions): void
	removeAllEventListeners(): void
}