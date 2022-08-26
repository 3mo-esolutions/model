import { component, html, ifDefined, style } from '../../../library'
import { DataGridColumnNumberBase } from '.'

@component('mo-data-grid-column-amount')
export class DataGridColumnAmount<TData> extends DataGridColumnNumberBase<TData> {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	getContentTemplate(value: number | undefined, _data: TData) {
		return html`<mo-amount value=${value ?? 0}></mo-amount>`
	}

	getEditContentTemplate(value: number | undefined, data: TData) {
		return html`
			<mo-field-amount dense
				label=${this.heading}
				value=${ifDefined(value)}
				@change=${(e: CustomEvent<number>) => this.handleEdit(e.detail, data)}
			></mo-field-amount>
		`
	}

	getSumTemplate(sum: number) {
		return html`
			<mo-amount value=${sum} ${style({ fontWeight: '500', color: 'var(--mo-accent)' })}></mo-amount>
		`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'mo-data-grid-column-amount': DataGridColumnAmount<unknown>
	}
}