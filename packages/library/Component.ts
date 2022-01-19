import { LitElement } from 'lit'
import { nothing, ComponentMixin } from '.'

LitElement.enabledWarnings = []

// REFACTOR: after https://github.com/microsoft/TypeScript/issues/35822 is solved,
// both ComponentMixin and StyleMixin can be moved into library.
// The following line would be then be `export abstract class Component extends ComponentMixin(LitElement)`
// and the class won't need any implementation.

export abstract class Component extends ComponentMixin(LitElement) {
	protected get template() {
		return nothing
	}

	protected override render() {
		return this.template
	}
}