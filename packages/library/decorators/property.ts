import { PropertyDeclaration, LitElement, PropertyValues } from 'lit'
// eslint-disable-next-line import/no-internal-modules
import { InternalPropertyDeclaration, property as propertyDecorator, state as stateDecorator } from 'lit/decorators.js'

type UpdatedCallback<T> = (value: T, oldValue: T) => void

type LitElementWithObservers = LitElement & {
	observers?: Map<PropertyKey, UpdatedCallback<any>>
}

export const updated = <T>(callback: UpdatedCallback<T>) => {
	return (prototype: LitElement, propertyKey: PropertyKey) => {
		const constructor = prototype.constructor as unknown as LitElementWithObservers
		if (!constructor.observers) {
			constructor.observers = new Map<PropertyKey, UpdatedCallback<any>>()
			const originalUpdated = prototype['updated']
			prototype['updated'] = function (this: LitElementWithObservers, changedProperties: PropertyValues) {
				originalUpdated.call(this, changedProperties)
				changedProperties.forEach((value, _key) => {
					const key = _key as keyof LitElementWithObservers
					const c = this.constructor as unknown as LitElementWithObservers
					const observers = c.observers
					const observer = observers?.get(key)
					if (observer !== undefined) {
						observer.call(this, this[key], value)
					}
				})
			}
			// eslint-disable-next-line no-prototype-builtins
		} else if (!constructor.hasOwnProperty('observers')) {
			// clone any existing observers of superclasses
			const observers = constructor.observers
			constructor.observers = new Map()
			observers.forEach((value, key) => constructor.observers?.set(key, value))
		}
		constructor.observers.set(propertyKey, callback)
	}
}

export const property = <T>(options?: PropertyDeclaration & { updated?: UpdatedCallback<T> }) => {
	return (prototype: LitElementWithObservers, propertyKey: PropertyKey) => {
		if (options?.updated) {
			updated(options.updated)(prototype, propertyKey)
		}
		return propertyDecorator(options)(prototype, propertyKey)
	}
}

export const state = <T>(options?: InternalPropertyDeclaration & { updated?: UpdatedCallback<T> }) => {
	return (prototype: LitElementWithObservers, propertyKey: PropertyKey) => {
		if (options?.updated) {
			updated(options.updated)(prototype, propertyKey)
		}
		return stateDecorator(options)(prototype, propertyKey)
	}
}