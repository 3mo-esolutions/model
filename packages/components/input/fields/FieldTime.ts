import { component, html, style } from '@a11d/lit'
import { FieldText } from '@3mo/field'

@component('mo-field-time')
export class FieldTime extends FieldText {
	override readonly inputMode = 'time'

	protected override get startSlotTemplate() {
		return html`
			<mo-icon @click=${() => this.focus()} icon='schedule' ${style({ color: 'var(--mo-color-gray)' })}></mo-icon>
			${super.startSlotTemplate}
		`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'mo-field-time': FieldTime
	}
}