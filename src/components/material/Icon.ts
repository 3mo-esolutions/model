import { component, property, ComponentMixin } from '../../library'
import { MaterialIcon } from '../../types'
import { Icon as MwcIcon } from '@material/mwc-icon'

@component('mo-icon')
export class Icon extends ComponentMixin(MwcIcon) {
	@property()
	get icon() { return this.textContent as MaterialIcon }
	set icon(value: MaterialIcon) { this.updateComplete.then(() => this.textContent = value) }

	@property()
	get fontSize() { return super.fontSize }
	set fontSize(value) {
		super.fontSize = value
		this.style.setProperty('--mdc-icon-size', value)
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'mo-icon': Icon
	}
}