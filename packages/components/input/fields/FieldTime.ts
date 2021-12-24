import { component, html, PropertyValues, renderContainer } from '../../../library'
import { FieldTextBase } from './FieldTextBase'

@component('mo-field-time')
export class FieldTime extends FieldTextBase {
	protected override firstUpdated(props: PropertyValues) {
		super.firstUpdated(props)
		this.inputElement.type = 'time'
	}

	@renderContainer('slot[name="leading"]')
	protected get timeIconTemplate() {
		return html`
			<mo-icon icon='schedule'></mo-icon>
		`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'mo-field-time': FieldTime
	}
}