import { component, property, css, ComponentMixin, HTMLTemplateResult } from '../../library'
import { MaterialIcon } from '..'
import { IconButton as MwcIconButton } from '@material/mwc-icon-button'

/**
 * @attr icon
 * @attr label
 * @attr disabled
 */
@component('mo-icon-button')
export class IconButton extends ComponentMixin(MwcIconButton) {
	@property() override icon!: MaterialIcon

	@property({ type: Boolean, reflect: true }) small = false


	protected override initialized() {
		this.buttonElement.setAttribute('part', 'button')
	}

	static override get styles() {
		return [
			...super.styles,
			css`
				:host {
					font-size: 20px;
					--mdc-icon-button-size: calc(var(--mdc-icon-size) * 2);
				}

				:host([small]) {
					--mdc-icon-button-size: calc(var(--mdc-icon-size) * 1.5);
				}

				.mdc-icon-button, .material-icons {
					font-size: inherit;
				}
			`
		]
	}

	protected override render() {
		const fontSize = getComputedStyle(this).getPropertyValue('font-size')
		this.style.setProperty('--mdc-icon-size', fontSize)
		this.style.setProperty('--mdc-icon-button-size', `calc(${fontSize} * ${this.small ? '1.5' : '2'})` )
		return super.render() as HTMLTemplateResult
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'mo-icon-button': IconButton
	}
}