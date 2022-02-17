import { html, component, Component, css, property } from '../../library'
import { Fab } from '.'

@component('mo-fab-group')
export class FabGroup extends Component {
	@property({ type: Boolean, reflect: true, updated(this: FabGroup) { this.updateFabElements() } }) open = false

	get fabElements() {
		return [...this.children].filter(c => c instanceof Fab) as Array<Fab>
	}

	static override get styles() {
		return css`
			:host {
				position: relative;
			}

			:host([open]) {
				z-index: 10;
			}

			:host([open]) {
				z-index: 10;
			}

			mo-div {
				margin-bottom: calc(56px + 16px);
				display: block;
			}

			:host(:not([open])) mo-div {
				visibility: collapse;
			}

			mo-fab {
				transition: var(--mo-duration-quick);
			}

			:host([open]) mo-fab {
				transform: rotate(45deg);
			}

			::slotted([mo-fab]) {
				transition: var(--mo-duration-quick);
				transform: scale(0);
				opacity: 0;
			}

			:host([open]) ::slotted([mo-fab]) {
				transform: scale(1);
				opacity: 1;
			}
		`
	}

	protected override get template() {
		return html`
			<mo-fab icon='add'
				@click=${() => this.open = !this.open}
			></mo-fab>

			<mo-div position='absolute' bottom='0' right='0'>
				<mo-flex direction='vertical-reversed' alignItems='end' gap='8px'>
					<slot @slotchange=${() => this.updateFabElements()}></slot>
				</mo-flex>
			</mo-div>
		`
	}

	private updateFabElements() {
		this.fabElements.forEach((fab, index) => {
			fab.showIconAtEnd = true
			fab.tabIndex = this.open ? 0 : -1
			const delay = this.open ? index * 25 : 0
			fab.style.transitionDelay = `${delay}ms`
		})
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'mo-fab-group': FabGroup
	}
}