function eventProperty(options?: EventInit) {
	return (prototype: unknown, propertykey: string) => {
		if (propertykey === undefined)
			return

		const eventFieldName = `__${propertykey}Event`
		Object.defineProperty(prototype, propertykey, {
			get(this) {
				if (!this[eventFieldName]) {
					this[eventFieldName] = this instanceof HTMLElement
						? new HTMLElementEvent(this, propertykey, options)
						: new PureEvent()
				}
				return this[eventFieldName]
			}
		})
	}
}

window.eventProperty = eventProperty