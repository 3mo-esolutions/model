/* eslint-disable */

function eventProperty(context: unknown, propertykey: string) {
	if (propertykey === undefined)
		return

	if (context instanceof HTMLElement) {
		Object.defineProperty(context, propertykey, {
			get(this: HTMLElement) { return new HTMLElementEvent(this, propertykey) },
		})
	} else {
		// FIX: this generated multiple events??

		const eventFieldName = `__${propertykey}Event`

		Object.defineProperty(context, eventFieldName, {
			value: new PureEvent(),
		})

		Object.defineProperty(context, propertykey, {
			get(this) { return this[eventFieldName] },
		})
	}
}

window.eventProperty = eventProperty