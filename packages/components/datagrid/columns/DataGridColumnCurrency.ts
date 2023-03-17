import { component, html, ifDefined, style } from '@a11d/lit'
import { DataGridColumnNumberBase } from '.'

/** @element mo-data-grid-column-currency */
@component('mo-data-grid-column-currency')
export class DataGridColumnCurrency<TData> extends DataGridColumnNumberBase<TData> {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	getContentTemplate(value: number | undefined, _data: TData) {
		return html`<mo-currency value=${value ?? 0}></mo-currency>`
	}

	getEditContentTemplate(value: number | undefined, data: TData) {
		return html`
			<mo-field-currency dense
				label=${this.heading}
				value=${ifDefined(value)}
				@change=${(e: CustomEvent<number>) => this.handleEdit(e.detail, data)}
			></mo-field-currency>
		`
	}

	getSumTemplate(sum: number) {
		return html`
			<mo-currency value=${sum} ${style({ fontWeight: '500', color: 'var(--mo-color-accent)' })}></mo-currency>
		`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'mo-data-grid-column-currency': DataGridColumnCurrency<unknown>
	}
}