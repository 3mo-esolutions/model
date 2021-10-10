import { LitElement, PropertyValues } from 'lit-element'
import { render, } from '..'

export const renderContainer = <T extends LitElement>(containerQuery: string) => {
	return (prototype: T, _property: string, descriptor: PropertyDescriptor) => {
		const renderTemplate = function (this: T) {
			let template: unknown | undefined
			if (typeof descriptor.get === 'function') {
				template = descriptor.get.call(this)
			} else if (typeof descriptor.value === 'function') {
				template = descriptor.value.call(this)
			}

			const container = this.shadowRoot?.querySelector(containerQuery)
			if (container) {
				render(template, container)
			}
		}

		const originalFirstUpdated = prototype['firstUpdated']
		prototype['firstUpdated'] = function (this: T, changedProperties: PropertyValues) {
			originalFirstUpdated.call(this, changedProperties)
			renderTemplate.call(this)
		}

		const originalRender = prototype['render']
		prototype['render'] = function () {
			renderTemplate.call(this)
			return originalRender.call(this)
		}
	}
}