import { component, property, ComponentMixin } from '../../library'
import { MaterialIcon } from '../../types'
import { Icon as MwcIcon } from '@material/mwc-icon'

@component('mo-icon')
export class Icon extends ComponentMixin(MwcIcon) {
	constructor() {
		super()
		this.size = 'var(--mo-font-size-icon)'
	}

	@property()
	get icon() { return this.textContent as MaterialIcon }
	set icon(value: MaterialIcon) { this.updateComplete.then(() => this.textContent = value) }

	@property()
	get size() { return this.style.getPropertyValue('--mdc-icon-size') }
	set size(value: string) { this.style.setProperty('--mdc-icon-size', value) }
}

declare global {
	interface HTMLElementTagNameMap {
		'mo-icon': Icon
	}
}