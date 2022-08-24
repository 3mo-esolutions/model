import { component, html, property, css } from '../../library'
import { CSSDirection } from '..'
import type * as CSS from 'csstype'
import { LayoutComponent } from './LayoutComponent'

@component('mo-flex')
export class Flex extends LayoutComponent {
	private static readonly flexDirectionByDirections = new Map<CSSDirection, string>([
		['horizontal', 'row'],
		['horizontal-reversed', 'row-reverse'],
		['vertical', 'column'],
		['vertical-reversed', 'column-reverse'],
	])

	@property()
	get direction() { return [...Flex.flexDirectionByDirections].find(([, flexDirection]) => this.style.flexDirection === flexDirection)?.[0] || 'vertical' }
	set direction(value) { this.style.flexDirection = Flex.flexDirectionByDirections.get(value) || 'column' }

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