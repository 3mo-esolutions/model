import { component, property, ComponentMixin } from '../../library'
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
export class IconButtonToggle extends ComponentMixin(MwcIconButtonToggle) {
	@property() onIcon!: MaterialIcon
	@property() offIcon!: MaterialIcon

	@eventProperty() readonly change!: IEvent

	@property({ type: Boolean })
	set small(value: boolean) { this.style.setProperty('--mdc-icon-button-size', `calc(var(--mdc-icon-size) * ${value ? '1.5' : '2'})`) }

	@property()
	get size() { return this.style.getPropertyValue('--mdc-icon-size') }
	set size(value: string) { this.style.setProperty('--mdc-icon-size', value) }

	protected initialized() {
		this.addEventListener('MDCIconButtonToggle:change', () => this.change.trigger())
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'mo-icon-button-toggle': IconButtonToggle
	}
}