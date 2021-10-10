import { component, property, event, ComponentMixin } from '../../library'
import { MaterialIcon } from '..'
import { IconButtonToggle as MwcIconButtonToggle } from '@material/mwc-icon-button-toggle'

/**
 * @attr on
 * @attr label
 * @attr disabled
 * @fires change {CustomEvent<{ isOn: boolean }>}
 * @slot onIcon
 * @slot offIcon
 */
@component('mo-icon-button-toggle')
export class IconButtonToggle extends ComponentMixin(MwcIconButtonToggle) {
	@property() override onIcon!: MaterialIcon
	@property() override offIcon!: MaterialIcon

	@event() readonly change!: EventDispatcher

	@property({ type: Boolean })
	set small(value: boolean) { this.style.setProperty('--mdc-icon-button-size', `calc(var(--mdc-icon-size) * ${value ? '1.5' : '2'})`) }

	@property()
	get size() { return this.style.getPropertyValue('--mdc-icon-size') }
	set size(value: string) { this.style.setProperty('--mdc-icon-size', value) }

	protected override initialized() {
		this.addEventListener('MDCIconButtonToggle:change', () => this.change.dispatch())
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'mo-icon-button-toggle': IconButtonToggle
	}
}