/* eslint-disable */

type EventHandler<T> = (data: T) => void

type CustomEventHandler<T> = (event: CustomEvent<T>) => void

interface CustomEvent<T, TElement extends HTMLElement = HTMLElement> extends Event {
	readonly detail: T
	readonly source: TElement
}

Object.defineProperty(Event.prototype, 'source', {
	get(this: Event) { return this.target },
	configurable: false,
})

interface HTMLElement {
	clone<T extends HTMLElement>(): T
	addEventListenerBase(type: string, listener: EventListener, options?: boolean | AddEventListenerOptions): void
	removeEventListenerBase(type: string, listener: EventListener, options?: boolean | EventListenerOptions): void

	addEventListener<T>(type: string, listener: CustomEventHandler<T>, options?: boolean | AddEventListenerOptions): void
	removeEventListener<T>(type: string, listener: CustomEventHandler<T>): void

	initializeEventHandlersIfNotExists(): void
	eventHandlers: Array<{ name: string, eventListener: (data: any) => void }>
	removeAllEventListeners(): void
}

HTMLElement.prototype.clone = function <T extends HTMLElement>() {
	const cloned = this.cloneNode(true) as T
	this.eventHandlers.forEach(ev => cloned.addEventListener(ev.name, ev.eventListener))
	return cloned as T
}

HTMLElement.prototype.initializeEventHandlersIfNotExists = function () {
	if (!this.eventHandlers) {
		this.eventHandlers = []
	}
}

HTMLElement.prototype.addEventListenerBase = HTMLElement.prototype.addEventListener
// @ts-ignore overriding other overload of the addEventListener
HTMLElement.prototype.addEventListener = function (type: string, listener: EventListener, options?: boolean | AddEventListenerOptions) {
	this.initializeEventHandlersIfNotExists()
	this.eventHandlers.push({ name: type, eventListener: listener })
	this.addEventListenerBase(type, listener, options)
}

HTMLElement.prototype.removeEventListenerBase = HTMLElement.prototype.removeEventListener
// @ts-ignore overriding other overload of the removeEventListener
HTMLElement.prototype.removeEventListener = function (type: string, listener: EventListener, options?: boolean | AddEventListenerOptions) {
	this.initializeEventHandlersIfNotExists()
	this.eventHandlers = this.eventHandlers.filter(ev => ev.name === type && ev.eventListener === listener)
	this.removeEventListenerBase(type, listener, options)
}

HTMLElement.prototype.removeAllEventListeners = function () {
	this.initializeEventHandlersIfNotExists()
	this.eventHandlers.forEach(event => this.removeEventListener(event.name, event.eventListener))
	this.eventHandlers = []
}