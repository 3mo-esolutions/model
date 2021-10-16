import { component, html, property, Component, css } from '../../library'
import { CSSDirection, IFlex } from '..'
import * as CSS from 'csstype'

@component('mo-flex')
export class Flex extends Component implements IFlex {
	@property()
	get flexDirection() { return this.style.flexDirection as CSS.Property.FlexDirection }
	set flexDirection(value) { this.style.flexDirection = value }

	@property()
	get direction(): CSSDirection {
		switch (this.flexDirection) {
			case 'column-reverse':
				return 'vertical-reversed'
			case 'row-reverse':
				return 'horizontal-reversed'
			case 'row':
				return 'horizontal'
			default:
				return 'vertical'
		}
	}
	set direction(value) {
		switch (value) {
			case 'horizontal':
				this.flexDirection = 'row'
				break
			case 'vertical':
				this.flexDirection = 'column'
				break
			case 'horizontal-reversed':
				this.flexDirection = 'row-reverse'
				break
			case 'vertical-reversed':
				this.flexDirection = 'column-reverse'
				break
		}
	}

	@property()
	get wrap() { return this.style.flexWrap as CSS.Property.FlexWrap }
	set wrap(value) { this.style.flexWrap = value }

	@property()
	get gap() { return this.style.gap as CSS.Property.Gap<string> }
	set gap(value) { this.style.gap = value }

	static override get styles() {
		return css`
			:host {
				display: flex;
				flex-direction: column;
				flex-wrap: nowrap;
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
		'mo-flex': Flex
	}
}