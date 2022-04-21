import { component, css, Component, html, property, eventListener } from '../library'

@component('mo-anchor')
export class Anchor extends Component {
	private static readonly voidHref = 'javascript:void(0)'

	@property({ type: String }) href = Anchor.voidHref

	@eventListener('auxclick')
	protected auxClickHandler(e: MouseEvent) {
		const EventConstructor = e.constructor as Constructor<Event>
		if (this.href === Anchor.voidHref) {
			this.dispatchEvent(new EventConstructor('click', e))
		}
	}

	static override get styles() {
		return css`
			a {
				color: var(--mo-accent);
			}
		`
	}

	protected override get template() {
		return html`
			<a href=${this.href}><slot></slot></a>
		`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'mo-anchor': Anchor
	}
}