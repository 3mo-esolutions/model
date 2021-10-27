import { Component, component, css, html, property } from '../../../library'
import { Splitter } from './Splitter'

// REFACTOR: use lit-html for templating
@component('mo-splitter-item')
export class SplitterItem extends Component {
	@property({ reflect: true, observer(this: SplitterItem) { this.calculateStyles() } }) size = ''
	@property({ reflect: true, observer(this: SplitterItem) { this.calculateStyles() } }) min = '50px'
	@property({ reflect: true, observer(this: SplitterItem) { this.calculateStyles() } }) max = ''

	private get splitter() {
		return this.parentElement as Splitter
	}

	calculateStyles() {
		switch (this.splitter.direction ?? 'vertical') {
			case 'horizontal':
			case 'horizontal-reversed':
				this.style.width = this.size
				this.style.minWidth = this.min
				this.style.maxWidth = this.max
				this.style.flexDirection = 'column'
				break
			case 'vertical':
			case 'vertical-reversed':
				this.style.height = this.size
				this.style.minHeight = this.min
				this.style.maxHeight = this.max
				this.style.flexDirection = 'row'
				break
		}
	}

	static override get styles() {
		return css`
			:host {
				display: flex;
				user-select: none;
			}

			::slotted(:first-child) {
				flex: 1;
			}
		`
	}

	protected override get template() {
		return html`
			<slot></slot>
		`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'mo-splitter-item': SplitterItem
	}
}