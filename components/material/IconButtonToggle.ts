import { component, property, componentize } from '../../library'
import { MaterialIcon } from '../../types'
import { IconButtonToggle as MwcIconButtonToggle } from '@material/mwc-icon-button-toggle'

/**
 * @attr on
 * @attr label
 * @attr disabled
 * @fires change
 * @slot onIcon
 * @slot offIcon
 */
@component('mo-icon-button-toggle')
export default class IconButtonToggle extends componentize(MwcIconButtonToggle) {
	@property() onIcon!: MaterialIcon
	@property() offIcon!: MaterialIcon

	@eventProperty readonly changed!: IEvent

	@property({ type: Boolean })
	set small(value: boolean) { this.style.setProperty('--mo-icon-button-size', `calc(var(--mo-icon-size) * ${value ? '1.5' : '2'})`) }

	@property()
	get size() { return this.style.getPropertyValue('--mo-icon-size') }
	set size(value: string) { this.style.setProperty('--mo-icon-size', value) }

	protected initialized() {
		this.addEventListener('MDCIconButtonToggle:change', () => this.changed.trigger())
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'mo-icon-button-toggle': IconButtonToggle
	}
}