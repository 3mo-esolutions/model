import { property as propertyDecorator, internalProperty as internalPropertyDecorator, PropertyDeclaration, InternalPropertyDeclaration } from 'lit-element'
import { Observer } from './Observer'
import IComponent from './IComponent'

export const element = <T extends HTMLElement>(prototype: T, property: string) => {
	Object.defineProperty(prototype, property, {
		get: function () {
			return this.shadowRoot.getElementById(property)
		}
	})
}

export const observer = <T>(fn: Observer<T>) => {
	return (component: IComponent, propertyKey: PropertyKey) => {
		component.constructor.observers.set(propertyKey, fn)
	}
}

export const property = <T>(options?: PropertyDeclaration & { observer?: Observer<T> }) => {
	return (component: IComponent, propertyKey: PropertyKey) => {
		if (options?.observer) {
			observer(options.observer)(component, propertyKey)
		}
		return propertyDecorator(options)(component, propertyKey)
	}
}

export const internalProperty = <T>(options?: InternalPropertyDeclaration & { observer?: Observer<T> }) => {
	return (component: IComponent, propertyKey: PropertyKey) => {
		if (options?.observer) {
			observer(options.observer)(component, propertyKey)
		}
		return internalPropertyDecorator(options)(component, propertyKey)
	}
}