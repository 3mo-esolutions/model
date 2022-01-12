import { component, css, html, renderContainer, nothing, property, event } from '../../library'
import { Button } from '..'

/**
 * @fires delete {CustomEvent}
 */
@component('mo-chip')
export class Chip extends Button {
	@event() readonly delete!: EventDispatcher

	@property({ type: Boolean, reflect: true }) hasDelete = false

	override unelevated = true

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
					height: 30px;
					font-weight: auto !important;
					letter-spacing: normal !important;
					text-decoration: auto !important;
					text-transform: auto !important;
				}
			`
		]
	}

	@renderContainer('slot[name="trailingIcon"]')
	protected get deleteIconButtonTemplate() {
		return !this.hasDelete ? nothing : html`
			<mo-icon-button small icon='cancel' fontSize='16px'
				foreground='rgba(var(--mo-color-foreground-base), 0.5)'
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