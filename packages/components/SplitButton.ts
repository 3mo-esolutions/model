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
				--mo-button-horizontal-padding: 8px;
			}
		`
	}

	protected override get template() {
		return html`
			<mo-button-group type='raised'>
				<slot></slot>
				<mo-button @click=${(e: MouseEvent) => this.handleMoreClick(e)}>
					<mo-icon icon='keyboard_arrow_down'></mo-icon>
				</mo-button>
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