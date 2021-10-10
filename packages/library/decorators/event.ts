export function event(options?: EventInit) {
	return (prototype: unknown, propertyKey?: string) => {
		if (propertyKey === undefined) {
			return
		}

		const eventFieldName = `__${propertyKey}Event`
		Object.defineProperty(prototype, propertyKey, {
			get(this) {
				if (!this[eventFieldName]) {
					this[eventFieldName] = this instanceof HTMLElement
						? new HTMLElementEventDispatcher(this, propertyKey, options)
						: new PureEventDispatcher()
				}
				return this[eventFieldName]
			}
		})
	}
}

declare global {
	interface EventDispatcher<T = void> {
		dispatch(value: T): void
		subscribe(handler: EventHandler<T>): void
		unsubscribe(handler: EventHandler<T>): void
	}
}

export class PureEventDispatcher<T = void> implements EventDispatcher<T> {
	private handlers = new Array<EventHandler<T>>()

	subscribe(handler: EventHandler<T>) {
		this.handlers.push(handler)
	}

	unsubscribe(handler: EventHandler<T>) {
		this.handlers = this.handlers.filter(h => h !== handler)
	}

	dispatch(data: T) {
		this.handlers.slice(0).forEach(h => h(data))
	}
}

export class HTMLElementEventDispatcher<T = void> implements EventDispatcher<T> {
	private readonly handlersMap = new Map<EventHandler<T>, CustomEventHandler<T>>()

	constructor(private readonly target: HTMLElement, private readonly eventName: string, private readonly options?: EventInit) { }

	protected get handlers() {
		return this.target.eventHandlers
			.filter(e => e.name === this.eventName)
			.map(e => e.eventListener)
	}

	dispatch(value: T) {
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