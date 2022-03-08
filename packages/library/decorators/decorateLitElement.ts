/* eslint-disable no-prototype-builtins */
import { LitElement } from 'lit'

export const decorateLitElement = <T>({ constructorPropertyName, prototype, initialValue, lifecycleHooks }: {
	constructorPropertyName: string
	prototype: LitElement
	initialValue?: T
	lifecycleHooks: Map<string, (this: LitElement, data: T) => any>
}) => {
	const p = prototype as any
	const constructor = prototype.constructor as any
	const hasValue = !!constructor[constructorPropertyName]
	if (!hasValue) {
		const hasInheritedValue = !constructor.hasOwnProperty(constructorPropertyName)
		constructor[constructorPropertyName] = !hasInheritedValue === false
			? initialValue
			: Object.assign(initialValue, constructor[constructorPropertyName])
		for (const [lifecycleName, lifecycleFunction] of lifecycleHooks) {
			const originalFn = p[lifecycleName]
			p[lifecycleName] = function (this: LitElement, ...args: Array<any>) {
				originalFn.call(this, ...args)
				lifecycleFunction.call(this, constructor[constructorPropertyName] as T)
			}
		}
	}
	return constructor[constructorPropertyName] as T
}