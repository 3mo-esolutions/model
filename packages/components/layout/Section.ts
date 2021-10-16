import { Component, component, css, html, property } from '../../library'
import { CSSDirection } from '../helpers'
import { IFlex } from './IFlex'
import * as CSS from 'csstype'

@component('mo-section')
export class Section extends Component implements IFlex {
	@property() header = ''
	@property() direction: CSSDirection = 'vertical'
	@property() gap: CSS.Property.Gap<string> = 'unset'
	@property() wrap: CSS.Property.FlexWrap = 'unset'

	static override get styles() {
		return css`
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
		`
	}

	protected override get template() {
		return html`
			<h3>${this.header}</h3>
			<slot name='actions'></slot>
			<mo-flex direction=${this.direction} gap=${this.gap} wrap=${this.wrap}>
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