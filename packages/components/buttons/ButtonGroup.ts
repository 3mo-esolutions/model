import { Button, ButtonType, Flex } from '..'
import { component, css, Component, html, property, query } from '../../library'

@component('mo-button-group')
export class ButtonGroup extends Component {
	@property({ reflect: true }) direction: Flex['direction'] = 'horizontal'

	@property({ reflect: true }) type = ButtonType.Normal

	static override get styles() {
		return css`
			:host {
				border-radius: var(--mo-border-radius);
			}

			:host([type=raised]) {
				box-shadow: var(--mo-button-group-box-shadow, var(--mo-shadow));
			}

			::slotted(mo-button) {
				position: relative;
				--mdc-shape-small: 0px;
				--mdc-button-raised-box-shadow: none;
			}

			:host(:not([type=outlined])) ::slotted(mo-button:not(:last-child))::after {
				content: '';
				position: absolute;
				background: var(--mo-color-gray-transparent);
			}

			:host([direction=vertical]:not([type=outlined])) ::slotted(mo-button:not(:last-child))::after,
			:host([direction=vertical-reversed]:not([type=outlined])) ::slotted(mo-button:not(:last-child))::after {
				right: 15%;
				left: 15%;
				width: 70%;
				height: 1px;
			}

			:host([direction=vertical]:not([type=outlined])) ::slotted(mo-button:not(:last-child))::after {
				bottom: 0px;
			}

			:host([direction=vertical-reversed]:not([type=outlined])) ::slotted(mo-button:not(:last-child))::after {
				top: 0px;
			}

			:host([direction=horizontal]:not([type=outlined])) ::slotted(mo-button:not(:last-child))::after,
			:host([direction=horizontal-reversed]:not([type=outlined])) ::slotted(mo-button:not(:last-child))::after {
				top: 15%;
				bottom: 15%;
				height: 70%;
				width: 1px;
			}

			:host([direction=horizontal]:not([type=outlined])) ::slotted(mo-button:not(:last-child))::after {
				right: 0px;
			}

			:host([direction=horizontal-reversed]:not([type=outlined])) ::slotted(mo-button:not(:last-child))::after {
				left: 0px;
			}

			:host([direction=vertical]) ::slotted(mo-button:first-of-type) {
				--mdc-shape-small: var(--mo-border-radius) var(--mo-border-radius) 0 0;
			}

			:host([direction=vertical]) ::slotted(mo-button:last-of-type) {
				--mdc-shape-small: 0 0 var(--mo-border-radius) var(--mo-border-radius);
			}

			:host([direction=vertical-reversed]) ::slotted(mo-button:first-of-type) {
				--mdc-shape-small: 0 0 var(--mo-border-radius) var(--mo-border-radius);
			}

			:host([direction=vertical-reversed]) ::slotted(mo-button:last-of-type) {
				--mdc-shape-small: var(--mo-border-radius) var(--mo-border-radius) 0 0;
			}

			:host([direction=horizontal]) ::slotted(mo-button:first-of-type) {
				--mdc-shape-small: var(--mo-border-radius) 0 0 var(--mo-border-radius);
			}

			:host([direction=horizontal]) ::slotted(mo-button:last-of-type) {
				--mdc-shape-small: 0 var(--mo-border-radius) var(--mo-border-radius) 0;
			}

			:host([direction=horizontal-reversed]) ::slotted(mo-button:first-of-type) {
				--mdc-shape-small: 0 var(--mo-border-radius) var(--mo-border-radius) 0;
			}

			:host([direction=horizontal-reversed]) ::slotted(mo-button:last-of-type) {
				--mdc-shape-small: var(--mo-border-radius) 0 0 var(--mo-border-radius);
			}
		`
	}

	@query('slot') private readonly slotElement!: HTMLSlotElement

	protected get buttonElements() {
		const extractElementFromSlot = (slot: HTMLSlotElement): Array<Button> => {
			return slot.assignedElements()
				.flatMap(e => e instanceof HTMLSlotElement ? extractElementFromSlot(e) : [e])
				.filter((e): e is Button => e instanceof Button)
		}
		return extractElementFromSlot(this.slotElement)
	}

	protected override get template() {
		return html`
			<mo-flex direction=${this.direction}>
				<slot @slotchange=${() => this.buttonElements.forEach(b => b.type = this.type)}></slot>
			</mo-flex>
		`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'mo-button-group': ButtonGroup
	}
}