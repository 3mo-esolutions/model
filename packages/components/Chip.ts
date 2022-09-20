import { component, css, html, nothing, property, event, style, Component } from '../library'
import { ButtonType } from '.'

/**
 * @slot - The default slot.
 * @slot leading - The icon slot.
 * @slot trailing - The icon slot.
 *
 * @fires delete {CustomEvent}
 */
@component('mo-chip')
export class Chip extends Component {
	@event() readonly delete!: EventDispatcher

	@property({ type: Boolean, reflect: true }) hasDelete = false

	static override get styles() {
		return css`
			:host {
				display: inline-block;
				height: 36px;
				border-radius: 100px;
			}

			mo-button {
				--mo-button-accent-color: var(--mo-chip-background-color, rgba(var(--mo-color-foreground-base), 0.15));
				--mdc-theme-on-primary: var(--mo-chip-foreground-color, rgba(var(--mo-color-foreground-base), 0.8));
				--mo-button-horizontal-padding: 10px;
				height: 100%;
				border-radius: inherit;
				text-transform: none;
			}

			:host([hasDelete]) mo-button::part(button) {
				padding-right: 4px;
			}

			mo-button::part(button) {
				font-weight: auto !important;
				letter-spacing: normal !important;
				text-decoration: auto !important;
			}
		`
	}

	protected override get template() {
		return html`
			<mo-button type=${ButtonType.Unelevated}>
				<slot name='leading' slot='leading'></slot>
				<slot></slot>
				<slot name='trailing' slot='trailing'>
					${this.deleteIconButtonTemplate}
				</slot>
			</mo-button>
		`
	}

	protected get deleteIconButtonTemplate() {
		return !this.hasDelete ? nothing : html`
			<mo-icon-button icon='cancel' slot='trailing'
				${style({ margin: '0px', fontSize: '16px', color: 'rgba(var(--mo-color-foreground-base), 0.5)' })}
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