interface IEvent<T = void> {
	trigger(value: T): void
	subscribe(handler: EventHandler<T>): void
	unsubscribe(handler: EventHandler<T>): void
}

class PureEvent<T = void> implements IEvent<T> {
	private handlers = new Array<EventHandler<T>>()

	subscribe(handler: EventHandler<T>) {
		this.handlers.push(handler)
	}

	unsubscribe(handler: EventHandler<T>) {
		this.handlers = this.handlers.filter(h => h !== handler)
	}

	trigger(data: T) {
		this.handlers.slice(0).forEach(h => h(data))
	}
}

class HTMLElementEvent<T = void> implements IEvent<T> {
	constructor(private target: HTMLElement, private eventName: string, private options?: EventInit) { }

	private handlersMap = new Map<EventHandler<T>, CustomEventHandler<T>>()

	protected get handlers() {
		return this.target.eventHandlers
			.filter(e => e.name === this.eventName)
			.map(e => e.eventListener)
	}

	trigger(value: T) {
		this.target.dispatchEvent(new CustomEvent<T>(this.eventName, { detail: value, ...this.options }))
	}

	subscribe(handler: EventHandler<T>) {
		const nativeHandler = (event: CustomEvent<T>) => handler(event.detail)
		this.target.addEventListener(this.eventName, nativeHandler)
		this.handlersMap.set(handler, nativeHandler)
	}

	unsubscribe(handler: EventHandler<T>) {
		const nativeHandler = this.handlersMap.get(handler)
		if (nativeHandler) {
			this.target.removeEventListener(this.eventName, nativeHandler)
		}
		this.handlersMap.delete(handler)
	}
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface Window {
	PureEvent: typeof PureEvent
	HTMLElementEvent: typeof HTMLElementEvent
}

window.PureEvent = PureEvent
window.HTMLElementEvent = HTMLElementEvent