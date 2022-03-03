import { Component, component, css, html, property } from '../../../library'
import { Splitter } from './Splitter'

@component('mo-splitter-item')
export class SplitterItem extends Component {
	@property({ updated(this: SplitterItem) { this.splitter.requestUpdate() } }) size?: string
	@property({ updated(this: SplitterItem) { this.splitter.requestUpdate() } }) min = '50px'
	@property({ updated(this: SplitterItem) { this.splitter.requestUpdate() } }) max?: string

	private get splitter() {
		return this.parentElement as Splitter
	}

	static override get styles() {
		return css`
			:host {
				overflow: hidden;
				position: relative;
				display: block;
				height: 100%;
				width: 100%;
			}

			::slotted(:first-child) {
				height: 100%;
				width: 100%;
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