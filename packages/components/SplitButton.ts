import { component, css, Component, html, property } from '../library'

@component('mo-split-button')
export class SplitButton extends Component {
	@property({ type: Boolean, reflect: true }) open = false

	static override get styles() {
		return css`
			:host {
				display: block;
			}

			::slotted(mo-button) {
				--mdc-shape-small: var(--mo-border-radius) 0 0 var(--mo-border-radius);
			}

			mo-button {
				--mdc-button-horizontal-padding: 8px;
				--mo-button-min-width: 0px;
				--mo-button-icon-margin-right: 0px;
			}
		`
	}

	protected override get template() {
		return html`
			<mo-button-group type='raised'>
				<slot></slot>
				<mo-button leadingIcon='keyboard_arrow_down' @click=${(e: MouseEvent) => this.handleMoreClick(e)}></mo-button>
			</mo-button-group>
			<mo-menu fixed
				.anchor=${this as any}
				corner='BOTTOM_LEFT'
				?open=${this.open}
				@opened=${() => this.open = true}
				@closed=${() => this.open = false}
			>
				<slot name='more' @click=${(e: MouseEvent) => e.stopImmediatePropagation()}></slot>
			</mo-menu>
		`
	}

	private handleMoreClick(e: MouseEvent) {
		e.stopImmediatePropagation()
		this.open = true
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'mo-split-button': SplitButton
	}
}