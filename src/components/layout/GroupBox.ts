import { Component, component, property, html } from '../../library'
import { CSSDirection } from '../../types'

@component('mo-group-box')
export class GroupBox extends Component {
	@property() header = ''
	@property() gap?: string
	@property() direction: CSSDirection = 'vertical'
	@property({ type: Array }) gapElements: Array<Element> = this.childElements.filter(e => !e.slot)

	protected render = () => html`
		<style>
			:host {
				display: block;
			}

			h3 {
				margin: var(--mo-thickness-xl) 0 var(--mo-thickness-l) 0;
				padding: 0 var(--mo-thickness-xs);
				font-weight: 400;
				transition: var(--mo-duration-quick);
				font-size: var(--mo-font-size-l);
				color: var(--mo-color-foreground);
				place-self: flex-start;
			}

			h3:empty {
				display: none;
			}

			mo-card {
				margin: 0;
			}
		</style>
		<mo-flex height='100%' width='100%'>
			<h3>${this.header}</h3>
			<mo-card direction=${this.direction} .gap=${this.gap} .gapElements=${this.gapElements} height='*' part='card'>
				<slot></slot>
			</mo-card>
		</mo-flex>
	`
}

declare global {
	interface HTMLElementTagNameMap {
		'mo-group-box': GroupBox
	}
}