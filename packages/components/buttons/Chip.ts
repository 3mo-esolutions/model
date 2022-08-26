import { component, css, html, renderContainer, nothing, property, event, style } from '../../library'
import { Button, ButtonType } from '..'

/**
 * @fires delete {CustomEvent}
 */
@component('mo-chip')
export class Chip extends Button {
	@event() readonly delete!: EventDispatcher

	@property({ type: Boolean, reflect: true }) hasDelete = false

	override type = ButtonType.Unelevated

	static override get styles() {
		return [
			...super.styles,
			css`
				:host {
					--mdc-theme-primary: rgba(var(--mo-color-foreground-base), 0.15);
					--mdc-theme-on-primary: rgba(var(--mo-color-foreground-base), 0.8);
					--mdc-shape-small: 100px;
					--mdc-button-horizontal-padding: 8px;
					--mdc-typography-button-text-transform: none;
				}

				:host([hasDelete]) #button {
					padding-right: 4px;
				}

				#button {
					height: 30px !important;
					font-weight: auto !important;
					letter-spacing: normal !important;
					text-decoration: auto !important;
					text-transform: auto !important;
				}
			`
		]
	}

	@renderContainer('slot[name="trailingIcon"]')
	protected get trailingTemplate() {
		return this.deleteIconButtonTemplate
	}

	protected get deleteIconButtonTemplate() {
		return !this.hasDelete ? nothing : html`
			<mo-icon-button icon='cancel'
				${style({ fontSize: '16px', color: 'rgba(var(--mo-color-foreground-base), 0.5)' })}
				@click=${() => this.delete.dispatch()}
			></mo-icon-button>
		`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'mo-chip': Chip
	}
}