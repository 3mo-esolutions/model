import { PropertyDeclaration, LitElement, PropertyValues } from 'lit'
// eslint-disable-next-line import/no-internal-modules
import { InternalPropertyDeclaration, property as propertyDecorator, state as stateDecorator } from 'lit/decorators.js'
import { ComponentConstructor } from '..'

type LitElementWithObservers = LitElement & {
	constructor: ComponentConstructor
}

export const observer = <T>(observerFn: Observer<T>) => {
	return (prototype: LitElementWithObservers, propertyKey: PropertyKey) => {
		if (!prototype.constructor.observers) {
			prototype.constructor.observers = new Map<PropertyKey, Observer<any>>()
			const originalUpdated = prototype['updated']
			prototype['updated'] = function (this: LitElementWithObservers, changedProperties: PropertyValues) {
				originalUpdated.call(this, changedProperties)
				changedProperties.forEach((value, _key) => {
					const key = _key as keyof LitElementWithObservers
					const observers = this.constructor.observers
					const observer = observers.get(key)
					if (observer !== undefined) {
						observer.call(this, this[key], value)
					}
				})
			}
			// eslint-disable-next-line no-prototype-builtins
		} else if (!prototype.constructor.hasOwnProperty('observers')) {
			// clone any existing observers of superclasses
			const observers = prototype.constructor.observers
			prototype.constructor.observers = new Map()
			observers.forEach((value, key) => prototype.constructor.observers.set(key, value))
		}
		prototype.constructor.observers.set(propertyKey, observerFn)
	}
}

export const property = <T>(options?: PropertyDeclaration & { observer?: Observer<T> }) => {
	return (prototype: LitElementWithObservers, propertyKey: PropertyKey) => {
		if (options?.observer) {
			observer(options.observer)(prototype, propertyKey)
		}
		return propertyDecorator(options)(prototype, propertyKey)
	}
}

export const state = <T>(options?: InternalPropertyDeclaration & { observer?: Observer<T> }) => {
	return (prototype: LitElementWithObservers, propertyKey: PropertyKey) => {
		if (options?.observer) {
			observer(options.observer)(prototype, propertyKey)
		}
		return stateDecorator(options)(prototype, propertyKey)
	}
}