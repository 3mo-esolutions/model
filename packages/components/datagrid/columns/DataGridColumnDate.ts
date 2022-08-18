import { component, html, property } from '../../../library'
import { FormatHelper } from '../../../utilities'
import { DataGridColumn } from '.'

@component('mo-data-grid-column-date')
export class DataGridColumnDate<TData> extends DataGridColumn<TData, Date> {
	@property({ type: Boolean }) hideDatePicker = false

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	getContentTemplate(value: Date | undefined, _data: TData) {
		return html`${value ? FormatHelper.date(value) ?? '' : ''}`
	}

	getEditContentTemplate(value: Date | undefined, data: TData) {
		return html`
			<mo-field-date dense
				?hideDatePicker=${this.hideDatePicker}
				label=${this.heading}
				.value=${value}
				@change=${(e: CustomEvent<Date>) => this.handleEdit(e.detail, data)}
			></mo-field-date>
		`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'mo-data-grid-column-date': DataGridColumnDate<unknown>
	}
}