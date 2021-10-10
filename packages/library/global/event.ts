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
// @ts-ignore overriding other overload of the addEventListener
HTMLElement.prototype.addEventListener = function (type: string, listener: EventListener, options?: boolean | AddEventListenerOptions) {
	this.eventHandlers.push({ name: type, eventListener: listener })
	this.addEventListenerBase(type, listener, options)
}

HTMLElement.prototype.removeEventListenerBase = HTMLElement.prototype.removeEventListener
// @ts-ignore overriding other overload of the removeEventListener
HTMLElement.prototype.removeEventListener = function (type: string, listener: EventListener, options?: boolean | AddEventListenerOptions) {
	this.eventHandlers.forEach((e, i) => {
		if (e.name === type && e.eventListener === listener) {
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
	addEventListenerBase(type: string, listener: EventListener, options?: boolean | AddEventListenerOptions): void
	removeEventListenerBase(type: string, listener: EventListener, options?: boolean | EventListenerOptions): void

	addEventListener<T>(type: string, listener: CustomEventHandler<T>, options?: boolean | AddEventListenerOptions): void
	removeEventListener<T>(type: string, listener: CustomEventHandler<T>): void

	readonly eventHandlers: Array<{ name: string, eventListener: (data: any) => void }>
	removeAllEventListeners(): void
}