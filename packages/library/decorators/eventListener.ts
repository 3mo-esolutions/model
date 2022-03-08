/* eslint-disable no-prototype-builtins */
import { LitElement } from 'lit'
import { decorateLitElement } from './decorateLitElement'

type ShorthandEventListenerDecoratorOptions = [type: string, options?: EventListenerOptions | boolean]
type FullEventListenerDecoratorOptions = [{
	type: string
	target?: EventTarget
	options?: EventListenerOptions | boolean
}]
type EventListenerDecoratorOptions = ShorthandEventListenerDecoratorOptions | FullEventListenerDecoratorOptions

function extractArguments(args: EventListenerDecoratorOptions) {
	const short = ((args: EventListenerDecoratorOptions): args is ShorthandEventListenerDecoratorOptions => typeof args[0] === 'string')(args)
	return {
		type: short ? args[0] : args[0].type,
		target: short ? undefined : args[0].target,
		options: short ? args[1] : args[0].options,
	}
}

export const eventListener = (...eventListenerOptions: EventListenerDecoratorOptions) => {
	return (prototype: LitElement, property: string, descriptor?: PropertyDescriptor) => {
		decorateLitElement<Map<string, ReturnType<typeof extractArguments> & { descriptor?: PropertyDescriptor }>>({
			prototype,
			constructorPropertyName: '$eventListeners$',
			initialValue: new Map,
			lifecycleHooks: new Map([
				['connectedCallback', function (this, eventListeners) {
					for (const [propertyKey, { type, target, options, descriptor }] of eventListeners) {
						const eventTarget = target ?? this
						eventTarget.addEventListener(type, extractListener.call(this, propertyKey, descriptor), options)
					}
				}],
				['disconnectedCallback', function (this, eventListeners) {
					if (this.constructor.prototype === prototype) {
						for (const [propertyKey, { type, target, descriptor, options }] of eventListeners) {
							const eventTarget = target ?? this
							eventTarget.removeEventListener(type, extractListener.call(this, propertyKey, descriptor), options)
						}
					}
				}],
			])
		}).set(property, { ...extractArguments(eventListenerOptions), descriptor })
	}
}

function extractListener(this: LitElement, propertyKey: string, descriptor?: PropertyDescriptor) {
	const fn = !descriptor
		? Object.getOwnPropertyDescriptor(this, propertyKey)?.value
		: typeof descriptor.get === 'function'
			? descriptor.get
			: descriptor.value

	const isEventListenerOrEventListenerObject = (listener: unknown): listener is EventListenerOrEventListenerObject => {
		const isListener = typeof listener === 'function'
		// @ts-expect-error in operator does not narrow down the type
		const isListenerObject = typeof listener === 'object' && listener !== null && 'handleEvent' in listener && typeof listener.handleEvent === 'function'
		return isListener || isListenerObject
	}

	if (isEventListenerOrEventListenerObject(fn) === false) {
		throw new TypeError(`${this.constructor.name}${propertyKey} is not a function`)
	}

	const boundFunctionKey = `'BOUND_'${propertyKey}`

	if (this.constructor.hasOwnProperty(boundFunctionKey)) {
		return Object.getOwnPropertyDescriptor(this.constructor, boundFunctionKey)?.value
	}

	const boundFunction = fn.bind(this)
	Object.defineProperty(this.constructor, boundFunctionKey, {
		value: boundFunction,
		configurable: false,
		enumerable: false,
		writable: false,
	})

	return boundFunction
}