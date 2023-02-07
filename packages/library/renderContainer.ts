import { ReactiveElement, nothing, render } from '@a11d/lit'

/** @deprecated */
export const renderContainer = (containerQuery: string) => {
	return (prototype: ReactiveElement, _: string, descriptor: PropertyDescriptor) => {
		const Constructor = prototype.constructor as typeof ReactiveElement
		Constructor.addInitializer(element => {
			element.addController(new class {
				async hostUpdated() {
					let container = this.container
					if (!container) {
						await element.updateComplete
						container = this.container
					}
					if (container) {
						const template = typeof descriptor.get === 'function'
							? descriptor.get.call(element)
							: typeof descriptor.value === 'function'
								? descriptor.value.call(element)
								: nothing
						render(template, container)
					}
				}

				private get container() {
					return element.renderRoot.querySelector<HTMLElement>(containerQuery)
				}
			})
		})
	}
}