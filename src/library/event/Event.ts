import { HTMLElementEvent, PureEvent } from '../../types'

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
						? new HTMLElementEvent(this, propertyKey, options)
						: new PureEvent()
				}
				return this[eventFieldName]
			}
		})
	}
}