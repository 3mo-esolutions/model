import { component, html, property, Component, css } from '../../library'
import type * as CSS from 'csstype'

@component('mo-grid')
export class Grid extends Component {
	@property()
	get rowGap() { return this.style.rowGap as CSS.Property.RowGap<string> }
	set rowGap(value) { this.style.rowGap = value }

	@property()
	get columnGap() { return this.style.columnGap as CSS.Property.ColumnGap<string> }
	set columnGap(value) { this.style.columnGap = value }

	@property()
	get gap() { return this.style.gap as CSS.Property.Gap<string> }
	set gap(value) { this.style.gap = value }

	@property()
	get rows() { return this.style.gridTemplateRows.split('fr').join('*') }
	set rows(value) { this.style.gridTemplateRows = ` ${value}`.split('*').join('fr').split(' fr').join(' 1fr').substring(1) }

	@property()
	get columns() { return this.style.gridTemplateColumns.split('fr').join('*') }
	set columns(value) { this.style.gridTemplateColumns = ` ${value}`.split('*').join('fr').split(' fr').join(' 1fr').substring(1) }

	@property()
	get autoRows() { return this.style.gridAutoRows as CSS.Property.GridAutoRows<string> }
	set autoRows(value) { this.style.gridAutoRows = value }

	@property()
	get autoColumns() { return this.style.gridAutoColumns as CSS.Property.GridAutoColumns<string> }
	set autoColumns(value) { this.style.gridAutoColumns = value }

	static override get styles() {
		return css`
			:host {
				display: grid;
			}
		`
	}

	protected override get template() {
		return html`
			<slot></slot>
		`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'mo-grid': Grid
	}
}