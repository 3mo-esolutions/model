import { component, ComponentMixin } from '../../library'
import { LitVirtualizer } from '@lit-labs/virtualizer'
import { Scroller } from '..'

@component('mo-virtualized-scroll')
export class VirtualizedScroll extends ComponentMixin(LitVirtualizer) {
	static override get styles() {
		return Scroller.styles
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'mo-virtualized-scroll': VirtualizedScroll
	}
}