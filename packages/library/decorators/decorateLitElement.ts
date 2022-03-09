/* eslint-disable no-prototype-builtins */
import { LitElement } from 'lit'

export const decorateLitElement = <T>({ constructorPropertyName, prototype, initialValue, lifecycleHooks }: {
	constructorPropertyName: string
	prototype: LitElement
	initialValue: T
	lifecycleHooks: Map<string, (this: LitElement, data: T) => any>
}) => {
	const p = prototype as any
	const constructor = prototype.constructor as any
	const existingValue = Object.getOwnPropertyDescriptor(constructor, constructorPropertyName)?.value as T | undefined

	if (existingValue) {
		return existingValue
	}

	const inheritedValue = constructor[constructorPropertyName]
	const value = inheritedValue ? Object.assign(initialValue, inheritedValue) : initialValue
	Object.defineProperty(constructor, constructorPropertyName, { value })

	for (const [lifecycleName, lifecycleFunction] of lifecycleHooks) {
		const originalFunction = p[lifecycleName]
		p[lifecycleName] = function (this: LitElement, ...args: Array<any>) {
			originalFunction.call(this, ...args)
			lifecycleFunction.call(this, value)
		}
	}

	return value
}