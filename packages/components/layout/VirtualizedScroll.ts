import { component, ComponentMixin } from '../../library'
import { LitVirtualizer } from '@lit-labs/virtualizer'
import { Scroll } from './Scroll'

@component('mo-virtualized-scroll')
export class VirtualizedScroll extends ComponentMixin(LitVirtualizer) {
	static override get styles() {
		return Scroll.styles
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'mo-virtualized-scroll': VirtualizedScroll
	}
}