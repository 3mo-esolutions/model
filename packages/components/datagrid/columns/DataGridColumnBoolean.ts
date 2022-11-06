import { component, html, property, style } from '../../../library'
import { MaterialIcon } from '../..'
import { DataGridColumn } from '.'

@component('mo-data-grid-column-boolean')
export class DataGridColumnBoolean<TData> extends DataGridColumn<TData, boolean> {
	@property() trueIcon: MaterialIcon = 'done'
	@property() falseIcon: MaterialIcon = 'clear'

	@property() trueIconColor = 'var(--mo-color-accent)'
	@property() falseIconColor = 'var(--mo-color-gray)'

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	getContentTemplate(value: boolean | undefined, _data: TData) {
		return html`
			<mo-flex justifyContent='center' ${style({ height: '100%' })}>
				<mo-icon icon=${value ? this.trueIcon : this.falseIcon} ${style({ color: value ? this.trueIconColor : this.falseIconColor })}></mo-icon>
			</mo-flex>
		`
	}

	getEditContentTemplate(value: boolean | undefined, data: TData) {
		return html`
			<mo-checkbox label=${this.heading}
				?checked=${value}
				@change=${(e: CustomEvent<CheckboxValue>) => this.handleEdit(e.detail === 'checked', data)}
			></mo-checkbox>
		`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'mo-data-grid-column-boolean': DataGridColumnBoolean<unknown>
	}
}