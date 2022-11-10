import { component, property, css } from '@a11d/lit'
import { ComponentMixin } from '../../library'
import { LabelMixin, InputMixin } from '../helpers'
import { Radio as MwcRadio } from '@material/mwc-radio'

/**
 * @attr disabled
 * @attr name
 * @attr global
 */
@component('mo-radio')
export class Radio extends InputMixin(LabelMixin(ComponentMixin(MwcRadio))) {
	static override get styles() {
		return [
			...super.styles,
			css`
				:host {
					--mdc-radio-unchecked-color: var(--mo-color-foreground);
				}

				.mdc-radio {
					padding: 8px;
				}

				.mdc-radio .mdc-radio__native-control {
					height: 36px;
					width: 36px;
				}
			`
		]
	}

	@property({ type: Boolean })
	// @ts-expect-error overriding the value property
	get value(): boolean { return this.checked }
	// @ts-expect-error overriding the value property
	set value(value: boolean) { this.checked = value }

	override reducedTouchTarget = true
}

declare global {
	interface HTMLElementTagNameMap {
		'mo-radio': Radio
	}
}