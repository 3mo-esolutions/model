import { component } from '../../library'
import { LitVirtualizer } from 'lit-virtualizer'
import { Scroll } from '..'

@component('mo-virtualized-scroll')
export class VirtualizedScroll<T> extends LitVirtualizer<T> {
	static override get styles() {
		return Scroll.styles
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'mo-virtualized-scroll': VirtualizedScroll<unknown>
	}
}