import { component, property, componentize } from '../../library'
import { MaterialIcon } from '../../types'
import { Icon as MwcIcon } from '@material/mwc-icon'

@component('mdc-icon')
export default class Icon extends componentize(MwcIcon) {
	@property()
	set icon(value: MaterialIcon) { this.innerText = value }
	get icon() { return this.innerText as MaterialIcon }

	@property()
	set size(value: string) { this.style.setProperty('--mdc-icon-size', value) }
	get size() { return this.style.getPropertyValue('--mdc-icon-size') }
}