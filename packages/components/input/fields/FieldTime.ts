import { component, html, style } from '../../../library'
import { FieldTextBase } from './FieldTextBase'

@component('mo-field-time')
export class FieldTime extends FieldTextBase {
	protected override readonly inputType = 'time'

	protected override get template() {
		return html`
			<mo-icon icon='schedule' ${style({ color: 'var(--mo-color-gray)' })}></mo-icon>
			${super.template}
		`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'mo-field-time': FieldTime
	}
}