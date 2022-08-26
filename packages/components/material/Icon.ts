import { component, property, ComponentMixin, HTMLTemplateResult } from '../../library'
import { MaterialIcon } from '..'
import { Icon as MwcIcon } from '@material/mwc-icon'

@component('mo-icon')
export class Icon extends ComponentMixin(MwcIcon) {
	@property()
	get icon() { return this.textContent as MaterialIcon }
	set icon(value: MaterialIcon) { this.updateComplete.then(() => this.textContent = value) }

	protected override render() {
		const fontSize = getComputedStyle(this).getPropertyValue('font-size')
		this.style.setProperty('--mdc-icon-size', fontSize)
		return super.render() as HTMLTemplateResult
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'mo-icon': Icon
	}
}