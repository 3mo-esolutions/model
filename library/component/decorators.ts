import { property as propertyDecorator, internalProperty as internalPropertyDecorator, PropertyDeclaration, InternalPropertyDeclaration, LitElement, PropertyValues } from 'lit-element'
import { Observer } from './Observer'
import IComponent from './IComponent'

export const element = <T extends HTMLElement>(prototype: T, property: string) => {
	Object.defineProperty(prototype, property, {
		get: function () {
			return this.shadowRoot.getElementById(property)
		}
	})
}

export const observer = <T>(observerFn: Observer<T>) => {
	return (prototype: IComponent & LitElement, propertyKey: PropertyKey) => {
		if (!prototype.constructor.observers) {
			prototype.constructor.observers = new Map<PropertyKey, Observer<any>>()
			const originalUpdated = prototype['updated']
			prototype['updated'] = function (this: IComponent & LitElement, changedProperties: PropertyValues) {
				originalUpdated.call(this, changedProperties)
				changedProperties.forEach((value, _key) => {
					const key = _key as keyof IComponent
					const observers = this.constructor.observers
					const observer = observers.get(key)
					if (observer !== undefined) {
						observer.call(this, this[key], value)
					}
				})
			}
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
	return (prototype: IComponent & LitElement, propertyKey: PropertyKey) => {
		if (options?.observer) {
			observer(options.observer)(prototype, propertyKey)
		}
		return propertyDecorator(options)(prototype, propertyKey)
	}
}

export const internalProperty = <T>(options?: InternalPropertyDeclaration & { observer?: Observer<T> }) => {
	return (prototype: IComponent & LitElement, propertyKey: PropertyKey) => {
		if (options?.observer) {
			observer(options.observer)(prototype, propertyKey)
		}
		return internalPropertyDecorator(options)(prototype, propertyKey)
	}
}