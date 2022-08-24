import { html, property, Component } from '../../library'
import type CSS from 'csstype'

export abstract class LayoutComponent extends Component {
	@property()
	get justifyItems() { return this.style.justifyItems as CSS.Property.JustifyItems }
	set justifyItems(value) { this.style.justifyItems = value }

	@property()
	override get justifyContent() { return this.style.justifyContent as CSS.Property.JustifyContent }
	override set justifyContent(value) { this.style.justifyContent = value }

	@property()
	override get alignItems() { return this.style.alignItems as CSS.Property.AlignItems }
	override set alignItems(value) { this.style.alignItems = value }

	@property()
	get alignContent() { return this.style.alignContent as CSS.Property.AlignContent }
	set alignContent(value) { this.style.alignContent = value }

	protected override get template() {
		return html`<slot></slot>`
	}
}