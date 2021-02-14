import { component, html, property, Component } from '../library'
import { CSSDirection } from '../types'
import * as CSS from 'csstype'

@component('mo-flex')
export class Flex extends Component {
	@property()
	get flexDirection() { return this.style.flexDirection as CSS.Property.FlexDirection }
	set flexDirection(value) {
		this.style.flexDirection = value
		this.gap = this.gap
	}

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
	get basis() { return this.style.flexBasis }
	set basis(value) { this.style.flexBasis = value }

	@property()
	get wrap() { return this.style.flexWrap as CSS.Property.FlexWrap }
	set wrap(value) { this.style.flexWrap = value }

	@property({ type: Array, observer: applyGap }) gapElements: Array<Element> = Array.from(this.children)

	@property({ observer: applyGap }) gap?: string

	protected render = () => html`
		<style>
			:host {
				display: flex;
				flex-direction: column;
				flex-wrap: nowrap;
			}
		</style>
		<slot></slot>
	`
}

function applyGap(this: Flex) {
	if (!this.gap)
		return

	for (let i = 0; i < this.gapElements.length; i++) {
		const child = this.gapElements[i] as HTMLElement
		const marginStart = i !== 0 ? `calc(${this.gap} / 2)` : '0'
		const marginEnd = i !== this.gapElements.length - 1 ? `calc(${this.gap} / 2)` : '0'
		switch (this.direction) {
			case 'horizontal':
				child.style.margin = `0 ${marginEnd} 0 ${marginStart}`
				break
			case 'horizontal-reversed':
				child.style.margin = `0 ${marginStart} 0 ${marginEnd}`
				break
			case 'vertical':
				child.style.margin = `${marginStart} 0 ${marginEnd} 0`
				break
			case 'vertical-reversed':
				child.style.margin = `${marginEnd} 0 ${marginStart} 0`
				break
		}
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'mo-flex': Flex
	}
}