import { Component, component, event, html, property } from '@3mo/model/library'

/**
 * @fires countChange {CustomEvent<number>}
 */
@component('sample-counter-button')
export class CounterButton extends Component {
	@event() readonly countChange!: IEvent<number>

	@property({ type: Number }) count = 0

	protected render = () => html`
		<mo-button raised @click=${this.handleClick}>➕ Increase - ${this.count}</mo-button>
	`

	private handleClick = () => {
		this.count++
		this.countChange.dispatch(this.count)
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'sample-counter-button': CounterButton
	}
}