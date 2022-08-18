import { component, html, ifDefined, nothing } from '../../../library'
import { FormatHelper } from '../../../utilities'
import { DataGridColumnNumberBase } from '.'

@component('mo-data-grid-column-percentage')
export class DataGridColumnPercentage<TData> extends DataGridColumnNumberBase<TData> {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	getContentTemplate(value: number | undefined, _data: TData) {
		return html`${value === undefined || Number.isFinite(value) === false ? nothing : FormatHelper.percent(value)} %`
	}

	getEditContentTemplate(value: number | undefined, data: TData) {
		return html`
			<mo-field-percentage dense
				label=${this.heading}
				value=${ifDefined(value)}
				@change=${(e: CustomEvent<number>) => this.handleEdit(e.detail, data)}
			></mo-field-percentage>
		`
	}

	getSumTemplate(sum: number) {
		return html`${FormatHelper.percent(sum)} %`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'mo-data-grid-column-percentage': DataGridColumnPercentage<unknown>
	}
}