import { ReactiveElement, nothing, render } from '@a11d/lit'
import { decorateReactiveElement } from '@a11d/lit/dist/decorateReactiveElement'

export const customRendersSymbol = Symbol('customRenders')

/** @deprecated */
export const renderContainer = (containerQuery: string) => {
	return (prototype: ReactiveElement, _property: string, descriptor: PropertyDescriptor) => {
		decorateReactiveElement({
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

function renderAllTemplates(this: ReactiveElement, customRenders: Map<string, PropertyDescriptor>) {
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