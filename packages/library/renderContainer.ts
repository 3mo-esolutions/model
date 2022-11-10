import { LitElement, nothing, render } from '@a11d/lit'
import { decorateLitElement } from '@a11d/lit/dist/decorateLitElement'

export const customRendersSymbol = Symbol('customRenders')

export const renderContainer = (containerQuery: string) => {
	return (prototype: LitElement, _property: string, descriptor: PropertyDescriptor) => {
		decorateLitElement({
			prototype,
			constructorPropertyKey: customRendersSymbol,
			initialValue: new Map,
			lifecycleHooks: new Map([
				['firstUpdated', renderAllTemplates],
				['updated', renderAllTemplates],
			])
		}).set(containerQuery, descriptor)
	}
}

function renderAllTemplates(this: LitElement, customRenders: Map<string, PropertyDescriptor>) {
	const extractTemplate = (descriptor: PropertyDescriptor) => {
		if (typeof descriptor.get === 'function') {
			return descriptor.get.call(this)
		}

		if (typeof descriptor.value === 'function') {
			return descriptor.value.call(this)
		}

		return nothing
	}

	for (const [containerQuery, descriptor] of customRenders) {
		const template = extractTemplate(descriptor)
		const container = this.renderRoot.querySelector<HTMLElement>(containerQuery)
		if (container) {
			render(template, container)
		}
	}
}