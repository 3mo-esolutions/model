import { Component, component, html, ifDefined, property } from '../../library'

@component('mo-section')
export class Section extends Component {
	@property() header = ''
	@property() gap?: string

	protected render() {
		return html`
			<style>
				:host {
					position: relative;
					transition: var(--mo-duration-quick);
					background-color: transparent;
					display: flex;
					flex-direction: column;
				}

				:host(:empty) {
					display: none !important;
				}

				h3 {
					place-self: flex-start;
					margin: var(--mo-thickness-xxl) 0 var(--mo-thickness-s) 0;
					padding: 0 var(--mo-thickness-xs);
					color: var(--mo-accent);
					text-transform: uppercase;
					font-size: var(--mo-font-size-s);
					font-weight: 500;
				}

				h3:empty {
					display: none !important;
				}

				mo-flex {
					flex: 1;
					align-self: stretch;
				}

				slot[name=actions] {
					display: inline;
					position: absolute;
					top: 0px;
					right: 0px;
				}
			</style>
			<h3>${this.header}</h3>
			<slot name='actions'></slot>
			<mo-flex gap=${ifDefined(this.gap)} .gapElements=${this.childElements.filter(e => !e.slot) as Array<Element>}>
				<slot></slot>
			</mo-flex>
		`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'mo-section': Section
	}
}