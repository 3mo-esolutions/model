import { Component, component, property, html, css } from '../../library'
import { CSSDirection, IFlex } from '..'
import * as CSS from 'csstype'

/**
 * @slot
 * @slot header
 */
@component('mo-group-box')
export class GroupBox extends Component implements IFlex {
	@property() header = ''
	@property() direction: CSSDirection = 'vertical'
	@property() wrap: CSS.Property.FlexWrap = 'unset'
	@property() gap: CSS.Property.Gap<string> = 'unset'

	static override get styles() {
		return css`
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
		`
	}

	protected override get template() {
		return html`
			<mo-flex height='100%' width='100%'>
				<h3 part='header'>${this.header}</h3>
				<mo-card part='card' height='*' direction=${this.direction} wrap=${this.wrap} gap=${this.gap}>
					<slot></slot>
				</mo-card>
			</mo-flex>
		`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'mo-group-box': GroupBox
	}
}