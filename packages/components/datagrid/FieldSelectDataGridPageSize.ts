import { component, html, property, nothing } from '@a11d/lit'
import { DataGrid, DataGridPagination, FieldFetchableSelect } from '..'
import { ClientInfoHelper } from '../..'

@component('mo-field-select-data-grid-page-size')
export class FieldSelectDataGridPageSize extends FieldFetchableSelect<DataGridPagination> {
	private static readonly data = new Array<DataGridPagination>('auto', 10, 25, 50, 100, 250, 500)

	@property({ type: Object }) dataGrid?: DataGrid<any>

	protected override fetchData() {
		return Promise.resolve(FieldSelectDataGridPageSize.data)
	}

	protected override getOptionTemplate(size: DataGridPagination) {
		return size === 'auto' && (!this.dataGrid || this.dataGrid.supportsDynamicPageSize === false) ? nothing : html`
			<mo-option value=${size}>${size === 'auto' ? 'Auto' : size}</mo-option>
		`
	}

	protected override handleOptionSelection() {
		// Safari has an unknown bug, which causes a loop on some select components
		if (ClientInfoHelper.browser === 'Safari' && this.menuOptions?.index === this.value) {
			return
		}
		return super.handleOptionSelection()
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'mo-field-select-data-grid-page-size': FieldSelectDataGridPageSize
	}
}