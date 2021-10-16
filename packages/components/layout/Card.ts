import { component, html, property, Component, css } from '../../library'
import { CSSDirection, IFlex } from '..'
import * as CSS from 'csstype'

// TODO: redesign

@component('mo-card')
export class Card extends Component implements IFlex {
	@property() header = ''
	@property() direction: CSSDirection = 'vertical'
	@property() gap: CSS.Property.Gap<string> = 'unset'
	@property() wrap: CSS.Property.FlexWrap = 'unset'

	static override get styles() {
		return css`
			:host {
				--mo-card-padding-vertical: var(--mo-thickness-m);
				--mo-card-padding-horizontal: var(--mo-thickness-m);
				--mo-card-margin-vertical: var(--mo-thickness-m);
				--mo-card-margin-horizontal: var(--mo-thickness-s);
				display: block;
			}

			:host(:empty) {
				display: none !important;
			}

			slot[name] {
				display: block;
			}

			h3, ::slotted(h3[slot=header]) {
				margin: var(--mo-thickness-m) 0 var(--mo-thickness-xl) 0;
				padding: 0 var(--mo-thickness-s);
				font-weight: 500;
				transition: var(--mo-duration-quick);
				font-size: var(--mo-font-size-l);
				place-self: flex-start;
				color: var(--mo-accent);
			}

			h3:empty {
				display: none !important;
			}

			.card {
				flex: 1;
				align-self: stretch;
				padding: var(--mo-card-padding-vertical) var(--mo-card-padding-horizontal);
				margin: var(--mo-card-margin-vertical) var(--mo-card-margin-horizontal);
				background-color: var(--mo-color-surface);
				box-shadow: var(--mo-shadow);
				border-radius: var(--mo-border-radius);
				justify-content: inherit;
				align-items: inherit;
				height: calc(100% - calc(2 * calc(var(--mo-card-margin-vertical) + var(--mo-card-padding-vertical))));
			}
		`
	}

	protected override get template() {
		return html`
			<mo-flex class='card'>
				<slot name='header'>
					<h3 part='header'>${this.header}</h3>
				</slot>

				<mo-flex height='*' alignSelf='stretch' direction=${this.direction} gap=${this.gap} wrap=${this.wrap}>
					<slot></slot>
				</mo-flex>

				<slot name='actions'></slot>
			</mo-flex>
		`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'mo-card': Card
	}
}