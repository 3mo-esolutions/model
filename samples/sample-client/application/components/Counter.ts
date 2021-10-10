import { Component, component, event, html, property } from '@3mo/model'

/**
 * @fires countChange {CustomEvent<number>}
 */
@component('sample-counter')
export class Counter extends Component {
	@event() readonly countChange!: IEvent<number>

	@property({ type: Number }) count = 0

	protected override get template() {
		return html`
			<style>
				mo-flex * {
					width: 64px;
					height: 64px;
				}

				mo-button {
					--mdc-shape-small: 0px;
				}

				mo-flex {
					background: var(--mo-color-transparent-gray);
				}
			</style>

			<mo-flex direction='horizontal' alignItems='center'>
				<mo-button @click=${() => this.handleCountChange(this.count - 1)}>
					➖
				</mo-button>

				<mo-flex data-test-id='count' alignItems='center' justifyContent='center' fontSize='var(--mo-font-size-xl)'>
					${this.count}
				</mo-flex>

				<mo-button @click=${() => this.handleCountChange(this.count + 1)}>
					➕
				</mo-button>
			</mo-flex>
		`
	}

	private readonly handleCountChange = (count: number) => {
		this.count = count
		this.countChange.dispatch(this.count)
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'sample-counter': Counter
	}
}