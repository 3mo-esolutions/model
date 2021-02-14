import { component, html, property, Component } from '../library'

@component('mo-grid')
export class Grid extends Component {
	@property()
	get rowGap() { return this.style.rowGap }
	set rowGap(value) { this.style.rowGap = value }

	@property()
	get columnGap() { return this.style.columnGap }
	set columnGap(value) { this.style.columnGap = value }

	@property()
	get rows() { return this.style.gridTemplateRows.split('fr').join('*') }
	set rows(value) { this.style.gridTemplateRows = ` ${value}`.split('*').join('fr').split(' fr').join(' 1fr').substring(1) }

	@property()
	get columns() { return this.style.gridTemplateColumns.split('fr').join('*') }
	set columns(value) { this.style.gridTemplateColumns = ` ${value}`.split('*').join('fr').split(' fr').join(' 1fr').substring(1) }

	protected render = () => html`
		<style>
			:host {
				display: grid;
			}
		</style>
		<slot></slot>
	`
}

declare global {
	interface HTMLElementTagNameMap {
		'mo-grid': Grid
	}
}