import { component, property, componentize } from '../../library'
import { MaterialIcon } from '../../types'
import { IconButton as MwcIconButton } from '@material/mwc-icon-button'

/**
 * @attr icon
 * @attr label
 * @attr disabled
 */
@component('mo-icon-button')
export default class IconButton extends componentize(MwcIconButton) {
	@property() icon!: MaterialIcon

	@property({ type: Boolean })
	set small(value: boolean) { this.style.setProperty('--mo-icon-button-size', `calc(var(--mo-icon-size) * ${value ? '1.5' : '2'})`) }

	@property()
	get size() { return this.style.getPropertyValue('--mo-icon-size') }
	set size(value: string) { this.style.setProperty('--mo-icon-size', value) }

	constructor() {
		super()
		this.size = 'var(--mo-font-size-icon)'
		if (this.innerText !== '') {
			this.icon = this.innerText as MaterialIcon
			this.innerText = ''
		}
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'mo-icon-button': IconButton
	}
}