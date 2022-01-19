import { LitElement, nothing, PropertyValues, render } from 'lit'

type LitElementWithCustomRenders = LitElement & {
	customRenders?: Map<string, PropertyDescriptor>
}

function extractTemplate<T extends LitElement>(this: T, descriptor: PropertyDescriptor) {
	if (typeof descriptor.get === 'function') {
		return descriptor.get.call(this)
	}

	if (typeof descriptor.value === 'function') {
		return descriptor.value.call(this)
	}

	return nothing
}


function renderTemplate<T extends LitElement>(this: T, descriptor: PropertyDescriptor, containerQuery: string) {
	const template = extractTemplate.call(this, descriptor)
	const container = this.shadowRoot?.querySelector<HTMLElement>(containerQuery)
	if (container) {
		render(template, container)
	}
}

export const renderContainer = <T extends LitElement>(containerQuery: string) => {
	return (prototype: T, _property: string, descriptor: PropertyDescriptor) => {
		const constructor = prototype.constructor as unknown as LitElementWithCustomRenders
		if (!constructor.customRenders) {
			constructor.customRenders = new Map()
			const originalUpdated = prototype['updated']
			prototype['updated'] = function (this: LitElementWithCustomRenders, changedProperties: PropertyValues) {
				originalUpdated.call(this, changedProperties)
				const c = this.constructor as unknown as LitElementWithCustomRenders
				for (const [containerQuery, descriptor] of c.customRenders ?? []) {
					renderTemplate.call(this, descriptor, containerQuery)
				}
			}
			// eslint-disable-next-line no-prototype-builtins
		} else if (!constructor.hasOwnProperty('customRenders')) {
			// clone any existing customRenders of superclasses
			const customRenders = constructor.customRenders
			constructor.customRenders = new Map()
			customRenders.forEach((key, value) => constructor.customRenders?.set(value, key))
		}
		constructor.customRenders.set(containerQuery, descriptor)
	}
}